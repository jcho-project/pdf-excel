const fs = require("file-system"),
  pr = require("pdfreader");

fs.readFile("./test.pdf", (err, pdfBuffer) => {
  function readPDFPages(buffer, reader = (new pr.PdfReader())) {
    let pages = [];
    console.log(pages);
    return new Promise((resolve, reject) => {
      reader.parseBuffer(pdfBuffer, (err, item) => {
        if (err) {
          reject(err);

        } else if (!item) {
          resolve(pages);

        } else if (item.page) {
          pages.push({});

        } else if (item.text) {
          let row = pages[pages.length - 1][item.y] || [];
          row.push(item.text);
          pages[pages.length - 1][item.y] = row;
        }
      });
    });
  };
});

function parseInvoicePDF(pages) {
  const page = pages[0];

  const fields = {
    "Invoice Number": { row: "7.1", index: 1 },
    "Order Number": { row: "8.088", index: 1 },
    "Invoice Date": { row: "9.076", index: 1 },
    "Total Due": { row: "11.06", index: 1 }
  };

  const data = {};

  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    const val = page[field.row][field.index];

    data[key] = val;

    return data;
  });
}






