export class Cell {
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

export function CreateCellElement(cell) {
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

function getElementFromRowCol(row, col) {
  const cellId = `cell-${row}${col}`;
  return document.getElementById(cellId);
}
