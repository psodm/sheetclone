import { Cell, CreateCellElement } from "./cell.js";

const ROWS = 21;
const COLS = 11;

const sheetContainer = document.querySelector("#sheet-container");
const exportBtn = document.querySelector("#export-btn");

const spreadsheet = [];

exportBtn.onclick = function (e) {
  let csvContent = "";
  for (let i = 0; i < spreadsheet.length; i++) {
    csvContent +=
      spreadsheet[i]
        .filter((cell) => !cell.isHeader)
        .map((cell) => cell.data)
        .join(",") + "\n";
  }
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "spreadsheet.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  e.preventDefault();
  console.log("Exported to CSV");
  e.stopPropagation();
  console.log("Export button clicked");
  return false;
};

createSheet();
renderSheet();

function createSheet() {
  for (let i = 0; i < ROWS; i++) {
    let row = [];
    for (let j = 0; j < COLS; j++) {
      let cellData = "";
      if (j === 0) {
        cellData = i;
      }
      if (i === 0) {
        cellData = String.fromCharCode(64 + j);
      }
      if (!cellData || cellData === "@") {
        cellData = "";
      }
      const rowName = i;
      const colName =
        String.fromCharCode(64 + j) === "@" ? "" : String.fromCharCode(64 + j);
      const cell = new Cell(
        rowName,
        colName,
        j === 0 || i === 0,
        i === 0 || j === 0,
        cellData,
        i,
        j,
        false
      );
      row.push(cell);
    }
    spreadsheet.push(row);
  }
  console.log("spreadsheet", spreadsheet);
}

function renderSheet() {
  sheetContainer.innerHTML = ""; // Clear existing content
  sheetContainer.className = "sheet-container";
  for (let i = 0; i < spreadsheet.length; i++) {
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    for (let j = 0; j < spreadsheet[i].length; j++) {
      const cell = spreadsheet[i][j];
      rowElement.append(CreateCellElement(cell));
    }
    sheetContainer.append(rowElement);
  }
}
