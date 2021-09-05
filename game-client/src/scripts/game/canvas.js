import helpers from "../helpers";

function Canvas(game, settings) {
  if (!(this instanceof Canvas)) {
    return new Canvas(settings);
  }

  const {
    canvasContainerId,
    canvasBackgroundColor,
  } = settings;

  this.game = { canvas: {}, ...game };

  const {
    countCellsInWidth,
    countCellsInHeight,
    cellSize
  } = this.game.field;

  this.context = null;
  this.canvasWidth = countCellsInWidth * cellSize;
  this.canvasHeight = countCellsInHeight * cellSize;
  this.canvasContainerId = canvasContainerId;
  this.canvasBackgroundColor = canvasBackgroundColor;

  this.setContext();
}

Canvas.prototype._clear = function () {
  CanvasRenderingContext2D.prototype.clearRect.apply(this.context, helpers.asArray(arguments));
};

Canvas.prototype.clear = function () {
  this._clear(0, 0, this.canvasWidth, this.canvasHeight);

  return this;
};

Canvas.prototype.setContextAttrs = function (objectProps) {
  const { context } = this;

  for (let prop in objectProps) {
    context[prop] = objectProps[prop];
  }

  return this;
};

Canvas.prototype.drawLine = function (fromX, fromY, toX, toY, props = false) {
  const { context } = this;

  if (props) {
    this.setContextAttrs(props);
  }

  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.stroke();
};

Canvas.prototype.drawGridLine = Canvas.prototype.drawLine.partialRight({
  lineWidth: 0.2,
  strokeStyle: "#333",
});

Canvas.prototype.drawTapeLine = Canvas.prototype.drawLine.partialRight({
  lineWidth: 3,
  strokeStyle: "#fc0",
  lineCap: "round",
  lineJoin: "round",
});

Canvas.prototype.drawGrid = function () {
  const {
    cellSize,
    tapeSize,
    countTapes,
    countCellsInWidth,
    countCellsInHeight
  } = this.game.field;

  const {
    canvasWidth,
    canvasHeight
  } = this;

  for (let i = 0; i < countCellsInWidth; i++) {
    const x = i * cellSize;

    this.drawGridLine(x, 0, x, canvasHeight);
  }

  for (let j = 0; j < countCellsInHeight; j++) {
    const y = j * cellSize;

    this.drawGridLine(0, y, canvasWidth, y);
  }

  for (let k = 1; k < countTapes; k++) {
    const tapeX = k * cellSize * tapeSize;

    this.drawTapeLine(tapeX, 0, tapeX, canvasHeight);
  }

  return this;
};

Canvas.prototype.renderIntoDOM = function () {
  const {
    canvasWidth,
    canvasHeight,
    canvasContainerId
  } = this;

  const canvas = document.createElement("canvas");
  const container = document.getElementById(canvasContainerId);

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  if (container) {
    container.appendChild(canvas);
  } else {
    document.body.appendChild(canvas);
  }

  return canvas;
};

Canvas.prototype.setContext = function () {
  this.context = this.renderIntoDOM().getContext("2d");

  return this;
};

Canvas.prototype.fillBackground = function () {
  const {
    context,
    canvasWidth,
    canvasHeight,
    canvasBackgroundColor
  } = this;

  context.fillStyle = canvasBackgroundColor;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  return this;
};

export default Canvas;
