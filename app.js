const fs = require("file-system"),
  pr = require("pdfreader");

fs.readFile("./test.pdf", (err, pdfBuffer) => {
  new pr.PdfReader().parseBuffer(pdfBuffer, (err, item) => {
    let pages = [];
    if (err) {
      console.log(err)
    } else if (!item) {
      console.log(pages);
    } else if (item.text) {
      // console.log(item);
      let row = pages[pages.length - 1][item.y] || [];
      row.push(item.text);
      pages[pages.length - 1][item.y] = row;
    }
  });
});