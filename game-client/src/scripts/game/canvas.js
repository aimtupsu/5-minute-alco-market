import helpers from "../helpers";

import constants from "../../constants";

/**
 * Создаёт и настраивает Canvas - игровое поле.
 * 
 * @param settings  настройки, необходимые для создания и настройки игрового поля.
 * @param callbacks колбеки для элементов canvas.
 */
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

/**
 * Функция инициализации текущего игрового поля:
 *  - вычисляет размеры ячеек и количество данных ячеек по высоте/ширине игрового поля;
 *  - на основе размеров ячеек вычисляет реальные размеры игрового поля;
 *  - вычисляет размеры дорожек.
 */
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

/**
 * Функция, которая создаёт canvas в текущем контейнере игрового поля
 * и получает его 2D контекст. Полученный контекст записывается в поле this.context.
 */
Canvas.prototype._setContext = function () {
  this.context = this._renderIntoDOM().getContext('2d');
};

/**
 * Функция очистки игрового поля.
 * Под капотом выполняется функция clearRect на текущем контексте canvas,
 * в которую прокидывается массив аргументов.
 */
Canvas.prototype._clear = function () {
  CanvasRenderingContext2D.prototype.clearRect.apply(this.context, helpers.asArray(arguments));
};

/**
 * Функция очистки всего игрового поля.
 * @returns текущий очищенный Canvas.
 */
Canvas.prototype.clearAll = function () {
  this._clear(0, 0, this.canvasWidth, this.canvasHeight);

  return this;
};

/**
 * Функция установки атрибутов для текущего контекста canvas.
 * @param objectProps  устанавливаемые атрибуты.
 * @returns текущее игровое поле.
 */
Canvas.prototype._setContextAttrs = function (objectProps) {
  const { context } = this;

  for (let prop in objectProps) {
    context[prop] = objectProps[prop];
  }

  return this;
};

/**
 * Функция, которая рисует линию от точки (fromX,fromY) до точки (toX,toY).
 * Также перед рисованием в функции устанавливаются атрибуты props для текущего контекста canvas.
 * @param {*} fromX абсцисса начальной точки;
 * @param {*} fromY ордината начальной точки;
 * @param {*} toX   абсцисса конечной точки;
 * @param {*} toY   ордината конечной точки;
 * @param {*} props атрибуты контекста canvas, необходимый для рисования линии.
 */
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

/**
 * Функция для отрисовки тонких, тёмно-серых линий,
 * которые необходимы для отображения игровой сетки.
 *
 * Рисовка линий происходит посредством вызова функции drawLine
 * с заранее заданным массивом атрибутов для контекста canvas.
 * Заранее задаётся только самый правый параметр - массив атрибутов.
 * Параметры точек начала/конца нужно задавать вручную при вызове данной функции.
 */
Canvas.prototype.drawGridLine = Canvas.prototype.drawLine.partialRight({
  lineWidth: 0.2,
  strokeStyle: "#333",
});

/**
 * Функция для отрисовки жёлтых линий будущих дорожек с кассовыми лентами.
 *
 * Рисовка линий происходит посредством вызова функции drawLine
 * с заранее заданным массивом атрибутов для контекста canvas.
 * Заранее задаётся только самый правый параметр - массив атрибутов.
 * Параметры точек начала/конца нужно задавать вручную при вызове данной функции.
 */
Canvas.prototype.drawTapeLine = Canvas.prototype.drawLine.partialRight({
  lineWidth: 3,
  strokeStyle: "#fc0",
  lineCap: "round",
  lineJoin: "round",
});

/**
 * Функция для отрисовки игровой сетки - Grid.
 * @returns текущее игровое поле.
 */
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

/**
 * Функция, которая возвращает контейнер для игрового поля по Id из настроек.
 */
Canvas.prototype._getContainer = function () {
  return document.getElementById(this.canvasContainerId) || document.body;
};

/**
 * Функция, которая возвращает размеры контейнера игрового поля.
 */
Canvas.prototype._getSizeContainer = function (element) {
  const container = element || this._getContainer();

  const rect = container.getBoundingClientRect();

  return {
    w: helpers.round(rect.width),
    h: helpers.round(rect.height),
  };
};

/**
 * Создаёт новый элемент Canvas и помещает его в контейнер.
 * Контейнер достаётся по id из настроек.
 */
Canvas.prototype._renderIntoDOM = function () {
  const { canvasWidth, canvasHeight } = this;
  const container = this._getContainer();

  const canvas = document.createElement("canvas");

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  container.appendChild(canvas);

  return canvas;
};

/**
 * Функция, которая инициализирует event-listeners.
 * Первый event-listener слушает события изменения размера окна и перересовывает текущий canvas.
 * Второй event-listener слушает события клика в canvas и прокидывает координаты клика в колбек,
 * который обновляет статистику игры.
 * @private
 */
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

/**
 * Функция, которая вычисляет позиции лент на игровом поле.
 * @returns {*[]} массив позиций лент.
 */
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
