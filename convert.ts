import { docs_v1, drive_v3 } from "googleapis";

let startedList = false;
let listId = "";
let listCount = 0;
let htmlLines: string[] = [];

export async function getHtml(docs: docs_v1.Docs, file: drive_v3.Schema$File) {
  console.log("hello");
  const doc = await docs.documents.get({ documentId: file.id });
  console.log("doc", file.name, doc.data.body?.content);
  const elements = doc.data.body?.content;
  htmlLines = [];
  console.log("data", doc.data);
  const lists = doc.data.lists;
  console.log("data.lists", lists);
  if (lists) {
    Object.keys(lists).forEach((key) => {
      console.log("key:", key);
      const nesting = lists[key].listProperties?.nestingLevels;
      if (nesting) {
        nesting.forEach((nest) => console.log("nesting", nest));
      }
    });
  }
  console.log("body", doc.data.body);
  console.log("body.content", doc.data.body?.content);
  elements?.forEach((paragraph) => {
    console.log("adding paragraph");
    addParagraph(paragraph);
  });
  console.log("html", htmlLines);
}

const paragraphStylelMapping: Map<String, String> = new Map([
  ["HEADING_1", "h1"],
  ["HEADING_2", "h2"],
  ["HEADING_3", "h3"],
  ["HEADING_4", "h4"],
  ["HEADING_5", "h5"],
  ["HEADING_6", "h6"],
]);

function addParagraph(element: docs_v1.Schema$StructuralElement) {
  console.log("xxxxx");
  const childElements = element.paragraph?.elements;
  let text = "";
  if (childElements) {
    childElements.forEach((childElement) => {
      text += getTextAndStyle(childElement);
    });

    console.log("element", element);
    console.log(
      "element.paragraph",
      element.paragraph,
      "element.pargraph?.bullet",
      element.paragraph?.bullet
    );

    console.log(
      "element.paragraph.paragraphStyle",
      element.paragraph?.paragraphStyle
    );
    console.log("element.paragraph.elements", element.paragraph?.elements);
  }
  text = addParagraphStyle(element, text);
  text = addBulletStyle(element, text);
  htmlLines.push(text || "");
}

function getTextAndStyle(childElement: docs_v1.Schema$ParagraphElement) {
  let text = childElement.textRun?.content || "";
  const style = childElement.textRun?.textStyle;
  const boldIt = style?.bold;
  const htmlStyle = "bold";
  text = checkForStyle({ doStyle: style?.bold, text, htmlStyle: "bold" });
  text = checkForStyle({ doStyle: style?.italic, text, htmlStyle: "i" });
  console.log("debug", text, style);
  return text;
}

function checkForStyle({
  doStyle,
  text,
  htmlStyle,
}: {
  doStyle: boolean | undefined;
  text: string;
  htmlStyle: string;
}) {
  if (doStyle) {
    text = `<${htmlStyle}>${text}</${htmlStyle}>`;
  }
  return text;
}

function addParagraphStyle(
  element: docs_v1.Schema$StructuralElement,
  text: string
) {
  const docParagrahStyle = element.paragraph?.paragraphStyle?.namedStyleType;
  let htmlTag;
  if (docParagrahStyle) {
    htmlTag = paragraphStylelMapping.get(docParagrahStyle);
  }
  if (!htmlTag) {
    if (element.paragraph?.bullet) {
      htmlTag = "";
    } else {
      htmlTag = "p";
    }
  }

  return addTag(htmlTag, text);
}

function addBulletStyle(
  element: docs_v1.Schema$StructuralElement,
  text: string
) {
  const bullet = element.paragraph?.bullet;
  let startText = "";
  if (bullet) {
    console.log(
      "debug bullet",
      text.replace("\n", ""),
      startedList,
      bullet?.listId
    );
    if (bullet.listId !== listId) {
      listId = bullet.listId || "";
      listCount = 1;
    } else {
      listCount++;
      if (!startedList) {
        console.log("debug bullet b");
        startText = ` start="${listCount}"`;
      }
    }
    if (!startedList) {
      startedList = true;
      htmlLines.push(`<ol${startText}>`);
    }

    return addTag("li", text);
  } else {
    if (startedList) {
      startedList = false;
      htmlLines.push("</ol>");
    }
    return text;
  }
}
function addTag(htmlTag: string | String, text: string) {
  return htmlTag ? `<${htmlTag}>${text}</${htmlTag}>` : text;
}
