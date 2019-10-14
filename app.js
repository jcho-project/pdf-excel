const { promisify } = require("util");

const
  fs = require("file-system"),
  path = require("path"),
  pr = require("pdfreader"),
  parseData = require("./parser"),
  readPDFPages = require("./bufferer"),
  XLSX = require('xlsx'),
  readFileAsync = promisify(fs.readFile),
  readdirAsync = promisify(fs.readdir);

// ------------------------------
// FILE READER
// ------------------------------

const testFolder = "./sample/";

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

function getDir(dirPath) {
  return readdirAsync(dirPath);
}

function getFile(filePath) {
  return readFileAsync(filePath);
}

function readPdf(buffer) {
  return readPDFPages(buffer, new pr.PdfReader);
}

function parsePdf(array) {
  return parseData(array);
}

function getAllBuffer() {
  let promisesArray = [];

  getDir("C:\\Users\\junehyok.cho\\Desktop\\Personal\\0. Github\\pdf-excel\\sample\\")
    .then(promisesArray.push(getFile("C:\\Users\\junehyok.cho\\Desktop\\Personal\\0. Github\\pdf-excel\\sample\\2395540825_CD_1.pdf")))

  getDir("C:\\Users\\junehyok.cho\\Desktop\\Personal\\0. Github\\pdf-excel\\sample\\")
    .then(promisesArray.push(getFile("C:\\Users\\junehyok.cho\\Desktop\\Personal\\0. Github\\pdf-excel\\sample\\2395544244_CD_1.pdf")))

  return Promise.all(promisesArray);
}

getAllBuffer().then(x => {
  x.forEach((buffer) => {
    readPdf(buffer).then(y => {
      y.forEach((raw) => {
        console.log(parsePdf(raw));
      })
    });
  })
})

// ------------------------------
// DISPLAY EXCEL
// ------------------------------

function excel(data, dirName) {
  // XLSX
  const ws_name = "InvoiceData";

  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, ws_name);

  for (let i = 0; i < data.length; i++) {
    XLSX.writeFile(wb, dirName + ".xlsx");
  }
}