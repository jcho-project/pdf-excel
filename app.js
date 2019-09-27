const
  fs = require("file-system"),
  pr = require("pdfreader"),
  util = require("util"),
  parseData = require("./parser"),
  readPDFPages = require("./bufferer"),
  XLSX = require('xlsx');

// ------------------------------
// FILE READER
// ------------------------------

const testFolder = "./sample/";

// fs.readdir(testFolder, (err, list) => {
//   list.forEach(item => {
//     consolidate(item).then(x => console.log(x()))
//   })
// })

// ------------------------------
// RESULT DATA
// ------------------------------

async function resultData(buf, reader) {
  const newData = [];

  const data = await readPDFPages(buf, reader);

  newData.push(parseData(data));

  return newData;

}

// ------------------------------
// CONSOLIDATE DATA
// ------------------------------

function consolidate(file) {
  fs.readdir(testFolder, (err, list) => {
    fs.readFile(testFolder + file, (err, buffer) => {

      resultData(buffer, new pr.PdfReader);
    })
  })
}

// ------------------------------
// DISPLAY EXCEL
// ------------------------------

function excel(data) {
  // XLSX
  const ws_name = "InvoiceData";

  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, ws_name);

  XLSX.writeFile(wb, "testExcel.xlsx");
}


