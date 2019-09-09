const
  fs = require("file-system"),
  pr = require("pdfreader"),
  parseData = require("./parser"),
  readPDFPages = require("./bufferer");

  if (typeof XLSX == 'undefined') XLSX = require('xlsx');

  // ------------------------------
  // FILE READER
  // ------------------------------

  const testFolder = "./sample/"

fs.readdirAsync = function(dirname) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) => {
      if (err) reject(err);

      else resolve(filenames);
    });
  });
};

fs.readFileAsync = function(filename, enc) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, enc, (err, data) => {
      if (err) reject(err);

      else resolve(data);
    });
  });
};

fs.readdirAsync(testFolder).then((filenames) => {
  return Promise.all(filenames);
}).then((files) => {
  let consolidated = [];

  files.forEach((file) => {
    fs.readFile(testFolder + file, (err, pdfBuffer) => {
      resultData(pdfBuffer, new pr.PdfReader).then((x) => consolidated.push(x));
    })
  });
});

// fs.readdir(testFolder, (err, files) => {
//   let readFiles = [];

//   files.forEach(file => readFiles.push(file));

//   fs.readFile(testFolder + readFiles[0], (err, pdfBuffer) => {
//     resultData(pdfBuffer, new pr.PdfReader).then(data => excel(data));
//   });

//   // for (let i = 0; i < readFiles.length; i++) {
//   //   fs.readFile(testFolder + readFiles[i], (err, pdfBuffer) => {
//   //     resultData(pdfBuffer, new pr.PdfReader);
//   //     // checkPdf(pdfBuffer, new pr.PdfReader);
//   //   });
//   // }
// });

// ------------------------------
// RESULT DATA
// ------------------------------

async function resultData(buf, reader) {
  try {
    const newData = [];

    const data = await readPDFPages(buf, reader);

    newData.push(parseData(data));

    // // XLSX
    // fs.exists("./testExcel.xlsx", (exists) => {
    //   if (exists) {
    //     let current = XLSX.utils.sheet_to_json(ws);

    //     // console.log(current);

    //   } else if (!exists) {
    //     XLSX.utils.book_append_sheet(wb, ws, ws_name);
    //     XLSX.writeFile(wb, "testExcel.xlsx");
    //   }
    // })

    return newData;

  } catch (err) {
    console.error(err);
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

async function checkPdf(buf, reader) {
  try {
    const data = await readPDFPages(buf, reader);

    console.log(data);

    return data;

  } catch (err) {
    console.log(err);
  }
}

