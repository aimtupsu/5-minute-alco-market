import helpers from "../helpers";

import constants from "../../constants";

function Canvas(settings, callbacks = {}) {
  if (!(this instanceof Canvas)) {
    return new Canvas(settings, callbacks);
  }

  const {
    canvasContainerId,
    canvasBackgroundColor,
    countTapes,
    countCellsOnTape
  } = settings;

  this.callbacks = callbacks;
  this.context = null;
  this.cellSize = null;
  this.countCellsInWidth = null
  this.countCellsInHeight = null;
  this.canvasWidth = null;
  this.canvasHeight = null;
  this.tapeSize = null;
  this.countTapes = countTapes;
  this.countCellsOnTape = countCellsOnTape;
  this.canvasContainerId = canvasContainerId;
  this.canvasBackgroundColor = canvasBackgroundColor;

  this._initialize();
  this._setContext();
  this._bindEvents();
}

Canvas.prototype._initialize = function () {
  const { countTapes, countCellsOnTape } = this;
  const { w, h } = this._getSizeContainer();

  const cellSize = helpers.floor(w / countTapes / countCellsOnTape);
  const countCellsInWidth = helpers.floor(w / cellSize);
  const countCellsInHeight = helpers.floor(h / cellSize);

  this.cellSize = cellSize;
  this.countCellsInWidth = countCellsInWidth;
  this.countCellsInHeight = countCellsInHeight;
  this.canvasWidth = countCellsInWidth * cellSize;
  this.canvasHeight = countCellsInHeight * cellSize;
  this.tapeSize = countCellsInWidth / countTapes;
};

Canvas.prototype._setContext = function () {
  this.context = this._renderIntoDOM().getContext('2d');
};

Canvas.prototype._clear = function () {
  CanvasRenderingContext2D.prototype.clearRect.apply(this.context, helpers.asArray(arguments));
};

Canvas.prototype.clearAll = function () {
  this._clear(0, 0, this.canvasWidth, this.canvasHeight);

  return this;
};

Canvas.prototype._setContextAttrs = function (objectProps) {
  const { context } = this;

  for (let prop in objectProps) {
    context[prop] = objectProps[prop];
  }

  return this;
};

Canvas.prototype.drawLine = function (fromX, fromY, toX, toY, props = false) {
  const { context } = this;

  if (props) {
    this._setContextAttrs(props);
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
    canvasWidth,
    canvasHeight,
    cellSize,
    tapeSize,
    countTapes,
    countCellsInWidth,
    countCellsInHeight
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

Canvas.prototype._getContainer = function () {
  return document.getElementById(this.canvasContainerId) || document.body;
};

Canvas.prototype._getSizeContainer = function (element) {
  const container = element || this._getContainer();

  const rect = container.getBoundingClientRect();

  return {
    w: helpers.round(rect.width),
    h: helpers.round(rect.height),
  };
};

Canvas.prototype._renderIntoDOM = function () {
  const { canvasWidth, canvasHeight } = this;
  const container = this._getContainer();

  const canvas = document.createElement("canvas");

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  container.appendChild(canvas);

  return canvas;
};

Canvas.prototype._bindEvents = function () {
  const { cellSize, context: { canvas }, callbacks } = this;

  const rect = canvas.getBoundingClientRect();

  window.addEventListener('resize', () => {
    const { canvasWidth, canvasHeight } = this;

    this._initialize();

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    this.drawGrid();
  }, false);

  canvas.addEventListener("click", (event) => {
    const x = event.clientX - rect.left,
          y = event.clientY - rect.top;

    const resX = helpers.floor(x / cellSize),
          resY = helpers.floor(y / cellSize) + 1;

    callbacks.updateStats && callbacks.updateStats(constants.statsType.SCORE, { x: resX, y: resY });
  }, false);
};

Canvas.prototype.getTapesPositions = function () {
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

export default Canvas;
