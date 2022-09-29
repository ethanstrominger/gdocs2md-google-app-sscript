let depth = 0;
namespace convert {
  export function getHtml(doc) {
    var body = doc.getBody();
    var numChildren = body.getNumChildren();
    var output: string[] = [];
    var images = [];
    var listCounters = {};
    console.log("converting doc to html", numChildren);

    // Walk through all the child elements of the body.
    for (var i = 0; i < numChildren; i++) {
      var child = body.getChild(i);
      console.log("child: ", i, numChildren);
      output.push(processItem(child, listCounters, images));
      depth = depth - 1;
      console.log("processed item", i, depth);
    }

    var html = output.join("\n");
    return html;
  }
}

function processItem(
  item: any,
  listCounters: any,
  images: any,
  skipParagraphTag = false
): string {
  depth = depth + 1;
  var output: String[] = [];
  var prefix = "",
    suffix = "";

  const string = item?.toString();

  if (item.getType() == DocumentApp.ElementType.TABLE_CELL) {
    prefix = "<td>";
    suffix = "</td>";
  } else if (item.getType() == DocumentApp.ElementType.PARAGRAPH) {
    if (item.getNumChildren() == 0) return "";
    ({ prefix, suffix } = processParagraph(
      item,
      prefix,
      suffix,
      skipParagraphTag
    ));
  } else if (item.getType() == DocumentApp.ElementType.INLINE_IMAGE) {
    console.log("image call process item 2");
    processImage(item, images, output);
    depth = depth - 1;
    console.log("depth: ", depth);
  } else if (item.getType() === DocumentApp.ElementType.LIST_ITEM) {
    ({ prefix, suffix } = processList(item, listCounters, prefix, suffix));
  } else if (item.getType() === DocumentApp.ElementType.TABLE) {
    processTable(item, output);
  } else if (item.getText) {
    processText(item, output);
  }
  output.push(prefix);

  if (item.getNumChildren) {
    processChildren(item, output, listCounters, images, skipParagraphTag);
  }

  output.push(suffix);
  return output.join("");
}

function processList(
  item: any,
  listCounters: any,
  prefix: string,
  suffix: string
) {
  console.log("processing list item");
  var listItem = item;
  var gt = listItem.getGlyphType();
  var key = listItem.getListId() + "." + listItem.getNestingLevel();
  var counter = listCounters[key] || 0;

  // First list item
  if (counter == 0) {
    // Bullet list (<ul>):
    if (
      gt === DocumentApp.GlyphType.BULLET ||
      gt === DocumentApp.GlyphType.HOLLOW_BULLET ||
      gt === DocumentApp.GlyphType.SQUARE_BULLET
    ) {
      (prefix = '<ul class="small"><li>'), (suffix = "</li>");

      suffix += "</ul>";
    } else {
      // Ordered list (<ol>):
      (prefix = "<ol><li>"), (suffix = "</li>");
    }
  } else {
    prefix = "<li>";
    suffix = "</li>";
  }

  if (
    item.isAtDocumentEnd() ||
    item.getNextSibling().getType() != DocumentApp.ElementType.LIST_ITEM
  ) {
    if (
      gt === DocumentApp.GlyphType.BULLET ||
      gt === DocumentApp.GlyphType.HOLLOW_BULLET ||
      gt === DocumentApp.GlyphType.SQUARE_BULLET
    ) {
      suffix += "</ul>";
    } else {
      // Ordered list (<ol>):
      suffix += "</ol>";
    }
  }

  counter++;
  listCounters[key] = counter;
  return { prefix, suffix };
}

function processChildren(
  item: any,
  output: String[],
  listCounters: any,
  images: any,
  skipParagraphTagFirstChild = false
) {
  var numChildren = item.getNumChildren();

  // Walk through all the child elements of the doc.
  for (var i = 0; i < numChildren; i++) {
    const skipParagraphTag = skipParagraphTagFirstChild && i === 0;
    var child = item.getChild(i);
    console.log("child a1: ", i, numChildren, child?.item);
    output.push(processItem(child, listCounters, images, skipParagraphTag));
    depth = depth - 1;
  }
}

function processParagraph(
  item: any,
  prefix: string,
  suffix: string,
  skipParagraphTag = false
) {
  switch (item.getHeading()) {
    // Add a # for each heading level. No break, so we accumulate the right number.
    case DocumentApp.ParagraphHeading.HEADING6:
      (prefix = "<h6>"), (suffix = "</h6>");
      break;
    case DocumentApp.ParagraphHeading.HEADING5:
      (prefix = "<h5>"), (suffix = "</h5>");
      break;
    case DocumentApp.ParagraphHeading.HEADING4:
      (prefix = "<h4>"), (suffix = "</h4>");
      break;
    case DocumentApp.ParagraphHeading.HEADING3:
      (prefix = "<h3>"), (suffix = "</h3>");
      break;
    case DocumentApp.ParagraphHeading.HEADING2:
      (prefix = "<h2>"), (suffix = "</h2>");
      break;
    case DocumentApp.ParagraphHeading.HEADING1:
      (prefix = "<h1>"), (suffix = "</h1>");
      break;
    default:
      if (!skipParagraphTag) {
        (prefix = "<p>"), (suffix = "</p>");
      }
  }
  return { prefix, suffix };
}

function processText(item, output) {
  var text = item.getText();
  var indices = item.getTextAttributeIndices();

  if (indices.length <= 1) {
    // Assuming that a whole para fully italic is a quote
    if (item.isBold()) {
      output.push("**" + text + "**");
    } else if (item.isItalic()) {
      output.push("<blockquote>" + text + "</blockquote>");
    } else if (text.trim().indexOf("http://") == 0) {
      output.push('<a href="' + text + '" rel="nofollow">' + text + "</a>");
    } else {
      output.push(text);
    }
  } else {
    for (var i = 0; i < indices.length; i++) {
      var partAtts = item.getAttributes(indices[i]);
      var startPos = indices[i];
      var endPos = i + 1 < indices.length ? indices[i + 1] : text.length;
      var partText = text.substring(startPos, endPos);

      Logger.log(partText);

      if (partAtts.ITALIC) {
        output.push("*");
      }
      if (partAtts.BOLD) {
        output.push("**");
      }
      if (partAtts.UNDERLINE) {
        output.push("<u>");
      }

      // If someone has written [xxx] and made this whole text some special font, like superscript
      // then treat it as a reference and make it superscript.
      // Unfortunately in Google Docs, there's no way to detect superscript
      if (partText.indexOf("[") == 0 && partText[partText.length - 1] == "]") {
        output.push("<sup>" + partText + "</sup>");
      } else if (partText.trim().indexOf("http://") == 0) {
        output.push(
          '<a href="' + partText + '" rel="nofollow">' + partText + "</a>"
        );
      } else {
        output.push(partText);
      }

      if (partAtts.ITALIC) {
        output.push("*");
      }
      if (partAtts.BOLD) {
        output.push("**");
      }
      if (partAtts.UNDERLINE) {
        output.push("</u>");
      }
    }
  }
}

function processImage(item, images, output) {
  console.log("processing images");
  images = images || [];
  var blob = item.getBlob();
  var contentType = blob.getContentType();
  var extension = "";
  if (/\/png$/.test(contentType)) {
    extension = ".png";
  } else if (/\/gif$/.test(contentType)) {
    extension = ".gif";
  } else if (/\/jpe?g$/.test(contentType)) {
    extension = ".jpg";
  } else {
    throw "Unsupported image type: " + contentType;
  }
  var imagePrefix = "Image_";
  var imageCounter = images.length;
  var name = imagePrefix + imageCounter + extension;
  imageCounter++;
  output.push('<img src="cid:' + name + '" />');
  images.push({
    blob: blob,
    type: contentType,
    name: name,
  });
}

function processTable(item: GoogleAppsScript.Document.Table, output: String[]) {
  output.push("<table>");
  const numRows = item.getNumRows();
  for (let i = 0; i < numRows; i++) {
    processRow(item.getRow(i), output);
  }
  output.push("</table>");
}

function processRow(row: GoogleAppsScript.Document.TableRow, output) {
  output.push("<tr>");
  const numCells = row.getNumCells();
  for (let i = 0; i < numCells; i++) {
    processCell(row.getCell(i), output);
  }
  output.push("</tr>");
}
function processCell(cell: GoogleAppsScript.Document.TableCell, output) {
  console.log("child a2: ", cell, cell?.item);
  output.push(processItem(cell, output, null, true));
}
