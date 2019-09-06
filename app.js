const fs = require("file-system"),
  pr = require("pdfreader");

if (typeof XLSX == 'undefined') XLSX = require('xlsx');

// ------------------------------
// FILE READER
// ------------------------------

const testFolder = "./sample/"

fs.readdir(testFolder, (err, files) => {
  let readFiles = [];

  files.forEach(file => {
    readFiles.push(file)
  });

  // console.log(readFiles);

  for (let i = 0; i < readFiles.length; i++) {
    fs.readFile(testFolder + readFiles[i], (err, pdfBuffer) => {
      excel(pdfBuffer, new pr.PdfReader);
      // checkPdf(pdfBuffer, new pr.PdfReader);
    });
  }
});

// ------------------------------
// BUFFERER
// ------------------------------

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

// ------------------------------
// PARSER CONFIG
// ------------------------------

function parseData(pages) {

  const fields = {
    "SEQ_NO(M)": { page: undefined },
    "HOUSE_BL_NO(M)": { page: 0, row: 3.885, index: 5 },
    "SHIPMENT_DATE(YYYYMMDD)(M)": { page: undefined },
    "ARRIVAL_DATE(YYYYMMDD)(M)": { page: undefined },
    "SHIPMENT_COUNTRY_CODE(M)": { page: 0, row: 4.455, index: 3 },
    "SHIPMENT_METHOD_CODE(M)": { page: undefined },
    "ARRIVAL_PORT_CODE(M)": { page: 0, row: 3.885, index: 0 },
    "PRICE_TERMS_CODE(M)": { page: 0, row: 4.455, index: 2 },
    "SHIPMENT_CURRENCY_CODE(M)": { page: undefined },
    "FINAL_DESTINATION_CODE(M)": { page: 0, row: 3.885, index: 0 },
    "LINE_NUM(M)": { page: undefined },
    "ITEM_NO(M)": { page: 3, row: 23.638, index: 0 },
    "QUANTITY_SHIPPED(M)": { page: undefined },
    "UNIT_PRICE(M)": { page: undefined },
    "VAT_AMOUNT": { page: 0, row: 31.542, index: 5 },
    "IMPORT_DECLARATION_NO": { page: 0, row: 26.473, index: 0 },
    "IMPORT_DECLARATION_DATE(YYYYMMDD)": { page: 0, row: 2.76, index: 2 },
    "CC_AMOUNT": { page: 3, row: 26.473, index: 3 },
    "DUTY_AMOUNT": { page: 0, row: 29.847, index: 5 },
    "SHIPMENT_PORT_CODE": { page: undefined },
    "PACKING_QTY": { page: undefined },
    "PACKING_UNIT_CODE": { page: undefined },
    "CARGO_TYPE_CODE": { page: undefined },
    "TOTAL_CBM": { page: undefined },
    "GROSS_WEIGHT": { page: undefined },
    "CHARGEABLE_WEIGHT": { page: undefined },
    "GROSS_WEIGHT_UOM_CODE": { page: undefined },
    "VESSEL_FLIGHT_NAME": { page: undefined },
    "VENDOR_SITE_CODE": { page: undefined },
    "COURIER_FLAG": { page: undefined },
    "ITEM_SPEC": { page: undefined },
    "HS_NO": { page: 3, row: 22.513, index: 7 },
    "UNIT_OF_MEASURE": { page: undefined },
    "CC_COUNTRY_CODE": { page: undefined },
    "ORGANIZATION_CODE": { page: undefined }
  }

  const data = {};

  Object.keys(fields)
    .forEach((key) => {
      const field = fields[key];

      if (typeof pages[field.page] === "undefined" || typeof pages[field.page][field.row] === "undefined") {
        data[key] = "";
      } else {
        const val = pages[field.page][field.row][field.index];

        data[key] = val;
      }
    });

  // DATA CLEANUP
  data["ARRIVAL_PORT_CODE(M)"] = "DE" + data["ARRIVAL_PORT_CODE(M)"];
  data["FINAL_DESTINATION_CODE(M)"] = "DE" + data["FINAL_DESTINATION_CODE(M)"];
  data["IMPORT_DECLARATION_DATE(YYYYMMDD)"] = data["IMPORT_DECLARATION_DATE(YYYYMMDD)"].split(".").reverse().join("");

  return data;
}

// ------------------------------
// RESULT & EXCEL OUTPUT
// ------------------------------

async function excel(buf, reader) {
  try {
    const newData = [];

    const data = await readPDFPages(buf, reader);

    newData.push(parseData(data));

    // XLSX
    const ws_name = "InvoiceData";

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(newData);

    fs.exists("./testExcel.xlsx", (exists) => {
      if (exists) {
        let current = XLSX.utils.sheet_to_json(ws);
        console.log(current);
      } else if (!exists) {
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
        XLSX.writeFile(wb, "testExcel.xlsx");
      }
    })

    return newData;

  } catch (err) {
    console.error(err);
  }
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

