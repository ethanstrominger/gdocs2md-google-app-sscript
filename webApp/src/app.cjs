import * as fetch from "node-fetch";
const url =
  "https://script.google.com/macros/s/AKfycbwyE9kgDB2UMF_vcrHMfCtUdwYCLlARdkbfHaufD9e-/dev";
main();

async function main() {
  const url2 = url + "?action=getfiles";
  console.log(url2);
  const response = await fetch(url2);
  console.log("response", response);
  // console.log("get", response.getContentText());
  // const myJson = await JSON.parse(response.getContentText()); //extract JSON from the http response
  // console.log(myJson);
}
