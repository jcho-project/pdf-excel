const
  fs = require("file-system"),
  pr = require("pdfreader"),
  util = require("util"),
  parseData = require("./parser"),
  readPDFPages = require("./bufferer");

if (typeof XLSX == 'undefined') XLSX = require('xlsx');

// ------------------------------
// FILE READER
// ------------------------------

const testFolder = "./sample/";
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

readdir(testFolder).then(list => {
  console.log(consolidate(list));
  // consolidate(list);
});

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

async function consolidate(files) {
  try {
    let results = [];

    return files.forEach(file => {
      readFile(testFolder + file).then((buffer) => {
        let promises = resultData(buffer, new pr.PdfReader);

        results.push(promises);
      })
    })

    // for (let i = 0; i < files.length; i++) {
    //   readFile(testFolder + files[i]).then((file) => {
    //     console.log(resultData(file, new pr.PdfReader))
    //     // checkPdf(pdfBuffer, new pr.PdfReader);
    //   });
    // }

  } catch (err) {
    console.log(err);
  }
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

// ------------------------------
// TEST
// ------------------------------

// async function checkPdf(buf, reader) {
//   try {
//     const data = await readPDFPages(buf, reader);

//     console.log(data);

//     return data;

//   } catch (err) {
//     console.log(err);
//   }
// }

