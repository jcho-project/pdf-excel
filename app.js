const fs = require("file-system"),
  pr = require("pdfreader");

fs.readFile("./sample/7512767742.pdf", (err, pdfBuffer) => {
  let rows = {};
  return new pr.PdfReader().parseBuffer(pdfBuffer, (err, item) => {
    if (err) {
      console.log(err);

    } else if (!item) {
      printRows(rows);
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

function printRows(o) {
  // Object.keys(rows).sort((y1, y2) => y1 - y2)
  // .forEach(y => console.log((rows[y] || []).join(" ")));

  let sorted = {};
  let key, a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort((y1, y2) => parseFloat(y1) - parseFloat(y2));

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }

  // console.log(sorted);

  return sorted;
};
