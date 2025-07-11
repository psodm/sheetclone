const ROWS = 21;
const COLS = 11;

const sheetContainer = document.querySelector("#sheet-container");
const exportBtn = document.querySelector("#export-btn");

const spreadsheet = [];

class Cell {
  constructor(
    rowName,
    colName,
    isHeader,
    disabled,
    data,
    row,
    column,
    active = false
  ) {
    this.rowName = rowName;
    this.colName = colName;
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.column = column;
    this.active = active;
  }
}

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
      rowElement.append(createCellElement(cell));
    }
    sheetContainer.append(rowElement);
  }
}

function createCellElement(cell) {
  const cellElement = document.createElement("input");
  cellElement.className = "cell";
  cellElement.id = `cell-${cell.row}${cell.column}`;
  cellElement.value = cell.data;
  cellElement.disabled = cell.disabled;
  if (cell.isHeader) {
    cellElement.classList.add("header");
  }
  cellElement.onclick = () => handleCellClick(cell);
  cellElement.onchange = () => handleOnChange(cell);
  cellElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleOnChange(cell);
      const nextCell = getElementFromRowCol(cell.row + 1, cell.column);
      if (nextCell) {
        nextCell.focus();
      }
    }
    if (e.key === "Tab") {
      e.preventDefault();
      handleOnChange(cell);
      const nextCell = getElementFromRowCol(cell.row, cell.column + 1);
      if (nextCell) {
        nextCell.focus();
      }
    }
  });
  return cellElement;
}

function handleCellClick(cell) {
  clearActiveHeaderCells();
  const columnHeaderElement = getElementFromRowCol(0, cell.column);
  const rowHeaderElement = getElementFromRowCol(cell.row, 0);
  columnHeaderElement.classList.toggle("active");
  rowHeaderElement.classList.toggle("active");
  document.querySelector(
    "#cell-status"
  ).innerHTML = `${cell.colName}${cell.rowName}`;
}

function getElementFromRowCol(row, col) {
  const cellId = `cell-${row}${col}`;
  return document.getElementById(cellId);
}

function clearActiveHeaderCells() {
  const activeCells = document.querySelectorAll(".cell.header.active");
  activeCells.forEach((cell) => {
    cell.classList.remove("active");
  });
}

function handleOnChange(cell) {
  const cellElement = getElementFromRowCol(cell.row, cell.column);
  if (cellElement) {
    cell.data = cellElement.value;
    console.log(`Cell ${cell.rowName}${cell.colName} updated to:`, cell.data);
  }
}
