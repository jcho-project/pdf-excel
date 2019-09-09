// ------------------------------
// BUFFERER
// ------------------------------

module.exports = function readPDFPages(buffer, reader = (new PdfReader())) {
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