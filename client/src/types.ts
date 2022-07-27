export type GetFilesParam = { action?: "getFiles"; folderName: string };
export type ConvertDocsParam = {
  action?: "convertDocs";
  folderName: string;
  fileName: string;
  outputFolderName: string;
};
export type GetHtmlParam = {
  action?: "getHtml";
  folderName: string;
  fileName: string;
};
export type Params = GetFilesParam | ConvertDocsParam | GetHtmlParam;
