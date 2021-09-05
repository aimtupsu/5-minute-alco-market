import helpers from "../helpers";

function Field(game, settings) {
  if (!(this instanceof Field)) {
    return new Field(settings);
  }

  const {
    canvasWidth,
    canvasHeight,
    countTapes,
    countProductsOnTape
  } = settings;

  const cellSize = Math.round(canvasWidth / countTapes / countProductsOnTape);
  const countCellsInWidth = helpers.round(canvasWidth / cellSize);
  const countCellsInHeight = helpers.round(canvasHeight / cellSize);

  this.game = { field: {}, ...game };
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
      x: i * tapeSize,
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
      x: helpers.getRandomNumber(
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
