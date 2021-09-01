import mathHelpers from "../helpers/math";

function Field(settings) {
  if (!(this instanceof Field)) {
    return new Field(settings);
  }

  const { cellSize, canvasWidth, canvasHeight, countTapes } = settings;

  const countCellsInWidth = canvasWidth / cellSize;
  const countCellsInHeight = canvasHeight / cellSize;

  this.cellSize = cellSize;
  this.countCellsInWidth = countCellsInWidth;
  this.countCellsInHeight = countCellsInHeight;
  this.tapeSize = countCellsInWidth / countTapes;
  this.countTapes = countTapes;
}

Field.prototype.getTapesPositions = function () {
  const { countTapes, tapeSize } = this;

  const positions = [];

  for (let i = 0; i < countTapes; i++) {
    positions.push({
      x: i * tapeSize + (i === 0 ? 0 : 1),
      y: i * tapeSize + tapeSize,
    });
  }

  return positions;
};

Field.prototype.getInitialRandomPosition = function () {
  const tapesPositions = this.getTapesPositions();

  console.log("tapesPositions: ", tapesPositions);

  const positions = tapesPositions.reduce((accumulator, currentValue) => {
    accumulator.push({
      x: mathHelpers.getRandomNumber(
        currentValue.x,
        currentValue.x + this.tapeSize - 1
      ),
      y: 0,
    });

    return accumulator;
  }, []);

  return positions;
};

export default Field;
