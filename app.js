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
//     consolidate(item).then(x => console.log(x))
//     // console.log(consolidate(item))
//   })
// })

// ------------------------------
// RESULT DATA
// ------------------------------

async function resultData(buf, reader) {
  try {
    const newData = [];

    const data = await readPDFPages(buf, reader);

    newData.push(parseData(data));

    return newData;

  } catch (err) {
    console.error(err);
  }
}

// ------------------------------
// CONSOLIDATE DATA
// ------------------------------

const int = [];

function consolidate(file) {
  return function runnable() {
    fs.readFile(testFolder + file, (err, buffer) => {

      return resultData(buffer, new pr.PdfReader);

      // console.log(int);
    })
  }
}

fs.readdir(testFolder, (err, list) => {
  for (let i = 0; i < 4; i++) {
    int.push(consolidate(list))
  }
})

const values = int.map(value => value());

console.log(values);

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


