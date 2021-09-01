function Cell(row, column) {
  if (!(this instanceof Cell)) {
    return new Cell(row, column);
  }

  this.row = row;
  this.column = column;
}

Cell.prototype.drawSquareCell = function (gameData) {
  const { cellSize } = gameData.field;
  const { context } = gameData.canvas;

  const x = this.row * cellSize,
    y = this.column * cellSize;

  context.fillRect(x, y, cellSize, cellSize);
};

export default Cell;
