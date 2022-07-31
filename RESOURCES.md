### Coding Resources

- [Code lab from Google](https://codelabs.developers.google.com/codelabs/clasp)
- [Quick Setup for Google Clasp](https://jasonjurotich.medium.com/quick-setup-for-google-clasp-fb4b8fc51f39)
- npmjs / github resources

  - [gatsby-source-google-docs](https://github.com/cedricdelpoux/gatsby-source-google-docs/) Over 300 non-dependabot commits, 2 branches, 80 closed issues, 4 open doc issues, 1 open code issue.  
    Did a test on one file, set up was made a lot easier by automating
    processes that you would otherwise have to manually do for credentials
    and authorizing a Google Cloud project.

    - [fork of above repo used to publish on npm](https://github.com/icaraps/gatsby-source-gdocs2md) and [npm](https://www.npmjs.com/package/gatsby-source-gdocs2md)
    - wikiGDrive: [github](https://github.com/mieweb/wikiGDrive#readme) [npm](https://www.npmjs.com/package/@mieweb/wikigdrive) Activity is more recent. Set up is not as automated as gatsby option. May have more tests. Looks like it outputs to google drive rather than local, which is less preferable.

    - @ahl389/markdoctor: converts markdown to Google Docs, so not appropriate.
    - @supersheets/docdown: README consists of a single line, last updated 4 years ago.
    - parse-google-docs-json: based on gatsby-source-gdocs2md. Has warning that it is for personal use.
    - google-docs-converter: limited functionality. Outputs on screen, does not write to file, only does one file at a time. Does not support Images, Tables, Centered text, Horizontal Rules (e.g. <hr>), overlapping styled text (bold text inside italic, etc)

- [Stack OverFlow: saving and accessing images with Apps Script](https://stackoverflow.com/questions/65728423/save-the-images-from-a-google-doc-to-google-drive-google-app-script)
- [Stack Overflow: Displaying Google Drive image on a website](https://stackoverflow.com/questions/15557392/how-do-i-display-images-from-google-drive-on-a-website)

- Archive
  - Alyssa built the Apps Script as seen in this [link](https://script.google.com/home/projects/1CFED97nWJO_zVzDvrN6wUztJVZQaDFUhrSKe3BXaaHhV02X5AgqT4mRR/edit). Alyssa is moving off the project and @ethanstrominger is now working on it.
  - [GoogleDoc2Html](https://github.com/oazabir/GoogleDoc2Html) is an open source project that was used as a base in July 2022 by Ethan Strominger. It was the top hit in google. However, searching npmjs.com turned out to be much more fruitful.

### Findings

- Read [DR: Use an existing add on converter called Docs to Markdown](https://github.com/hackforla/website/wiki/DR:-Use-an-existing-add-on-converter-called-Docs-to-Markdown) to learn about the add-on we were using and why we stopped using it.

### Tangential links

- [Guides Tracker Project Board, with filter on the word Slack](https://github.com/orgs/hackforla/projects/3?card_filter_query=slack)
- Most recent [Draft of Slack Reminder Guide](https://docs.google.com/document/d/1YxwE3Edz7xXPVZ156wbIaPlQj7UUssIWN-ctTqbBilE/edit#heading=h.ynbf41g36iqy) that the figma mockup is modeled after
- HackforLA.org/about page where you can see the floating menu https://www.hackforla.org/about/

### 100 Automations

- [ ] [Open a new automation proposal](https://github.com/100Automations/futureautomations/issues/new/choose)
- [ ] [100Automations Guides](https://100automations.org/all_guides)

### Resources/Instructions

- Folder with files needed for this issue: [Google Docs to Markdown Converter](https://drive.google.com/drive/folders/1A7fCpYTakb_3wCOv7fSM8oyN-wTkisA0)
- Wins to Review Folder - Ask permission from one of the HfLA Website Team's technical leads or merge team members
- ~[Figma Design Link for Guide Pages Redesign](https://www.figma.com/file/Jz8KoGTBIxdx9jRxBWrEsF/Guides-Team-Figma?node-id=127%3A4278)~
- [Figjam flowchart](https://www.figma.com/file/mczWg3oQqaBZiAl2OSV7rE/Website-Publication-Workflow)
- this is where Alyssa was working. All designs as of 2021-10-25 have been moved to [official HfLA website figma](https://www.figma.com/file/0RRPy1Ph7HafI3qOITg0Mr/Hack-for-LA-Website?node-id=695%3A0)

### Past Issues

Past Issues (All documentation that may be useful)

- https://github.com/hackforla/guides/issues/10#issuecomment-1066190743 - **Important!** Shows output from current Apps Script MD Converter
- https://github.com/hackforla/website/issues/1630#issuecomment-968714568 - Documentation of Progress Made for Guide Pages Redesign (General)
- Credits to [Tutorial on Google Apps Script - Markdown Converter](https://www.linkedin.com/learning/google-apps-script-for-javascript-developers/welcome?autoplay=true&u=35553996)
- [DR: Use an existing add on converter called Docs to Markdown](https://github.com/hackforla/website/wiki/DR:-Use-an-existing-add-on-converter-called-Docs-to-Markdown)
