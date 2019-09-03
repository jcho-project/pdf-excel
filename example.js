const fs = require("file-system"),
  pr = require("pdfreader");

if (typeof XLSX == 'undefined') XLSX = require('xlsx');

// BUFFER
function readPDFPages(buffer, reader = (new PdfReader())) {
  return new Promise((resolve, reject) => {

    let pages = [];

    reader.parseBuffer(buffer, (err, item) => {
      if (err)
        reject(err)

      else if (!item)
        resolve(pages);

      else if (item.page)
        pages.push({});

      else if (item.text) {
        const row = pages[pages.length - 1][item.y] || [];
        row.push(item.text);
        pages[pages.length - 1][item.y] = row;
      }
    });
  });
}

// PARSER
function parseData(pages) {
  const page = pages[0];

  const fields = {
    invoice_number: { row: 7.1, index: 1 },
    order_number: { row: 8.088, index: 1 },
    invoice_date: { row: 9.076, index: 1 },
    due_date: { row: 10.064, index: 1 },
    tax: { row: 25.246, index: 1 },
    total_due: { row: 26.242, index: 1 },
    bank: { row: 29.167, index: 0 },
    account: { row: 29.952, index: 0 },
    bsb: { row: 30.738, index: 0 },
    remarks: { row: 48.035, index: 0 }
  }

  const data = {};

  Object.keys(fields)
    .forEach((key) => {
      const field = fields[key];
      const val = page[field.row][field.index];

      data[key] = val;
    });

  return data;
}

async function parse(buf, reader) {
  try {
    const data = await readPDFPages(buf, reader);

    const newData = [];

    newData.push(parseData(data));

    // XLSX
    const ws_name = "InvoiceData";

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(newData);

    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    XLSX.writeFile(wb, "testExcel.xlsx");

    console.log(newData);

    return newData;

  } catch (err) {
    console.error(err);
  }
}

// FILE READER
fs.readFile("./sample/test.pdf", (err, pdfBuffer) => {
  parse(pdfBuffer, new pr.PdfReader);
  // console.log(result);
});




