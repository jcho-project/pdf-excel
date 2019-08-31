const fs = require("file-system"),
  pr = require("pdfreader");

let rows = [];

fs.readFile("./test.pdf", (err, pdfBuffer) => {
  new pr.PdfReader().parseBuffer(pdfBuffer, (err, item) => {
    if (err) {
      console.log(err)

    } else if (!item) {
      printRows();
      console.log("Done.");

    } else if (item.file) {
      console.log(`Parsing ${item.file && item.file.path || 'a buffer'}`);

    } else if (item.page) {
      console.log(`Reached page ${item.page}`);

    } else if (item.text) {
      // const itemAsString = [item.text, 'x: ' + item.x, 'y: ' + item.y, 'w: ' + item.w, 'sw: ' + item.sw].join('\n\t');
      // console.log('Text Item: ', itemAsString);
      (rows[item.y] = rows[item.y] || []).push(item.text);
    }
  });
});

function printRows() {
  Object.keys(rows).sort((y1, y2) => parseFloat(y1) - parseFloat(y2));
  // .forEach(y => console.log((rows[y] || []).join(" : ")));
  console.log(Object.keys(rows));
};