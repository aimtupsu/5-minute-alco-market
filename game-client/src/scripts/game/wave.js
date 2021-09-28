import Product from "./product";

import helpers from "../helpers";

import constants from "../../constants";

/**
 * Функция создания и инициализации волны товаров на лентах.
 * Волна - множество товаров, расположенных на игровом поле,
 * на так называемых лентах.
 * @param canvas
 * @param callbacks
 * @param images
 * @returns {Wave}
 * @constructor
 */
function Wave(canvas, callbacks = {}, images) {
  if (!(this instanceof Wave)) {
    return new Wave(canvas, callbacks);
  }

  this.canvas = canvas;
  this.images = images;
  this.callbacks = callbacks;
  this.products = [];

  this._initialize();
}

/**
 * Функция инициализации новой волны.
 * Получает рандомные позиции новых товаров волны и
 * в этих позиция затем создаёт новые товары.
 */
Wave.prototype._initialize = function () {
  const { images } = this;

  const productsPositions = this._getInitialRandomPosition();
  this.products = productsPositions.map((value, index) => new Product(index, images[index], value.x, value.y));

  this.products = products;
};

/**
 * Функция, которая возвращает рандомные позиции товаров для новой волны.
 * Новые позиции товаров рандомятся относительно позиций лент на игровом поле.
 * @returns {*} массив позиций товаров волны.
 */
Wave.prototype._getInitialRandomPosition = function () {
  const { canvas } = this;

  const tapesPositions = canvas.getTapesPositions();
  const initialYPositions = [];

  const positions = tapesPositions.reduce((accumulator, currentValue, _, array) => {
    const x = helpers.getRandomNumber(currentValue.x, currentValue.x + canvas.tapeSize - 1);
    const y = helpers.getRandomNumber(0, array.length - 1, initialYPositions);

    initialYPositions.push(y);
    accumulator.push({ x, y: -y });

    return accumulator;
  }, []);

  return positions;
};

/**
 * Функция отрисовки волны.
 * Вызывает поочерёдно функцию отрисовки для каждого товара волны.
 * @returns {Wave} текущую волну.
 */
Wave.prototype.draw = function () {
  const { canvas, products } = this;

  products.forEach((product) => { product.draw(canvas); });

  return this;
};

/**
 * Функция перемещения волны на новые позиции.
 * Каждый товар перемещается на 1 ячейку сверху вниз.
 * @returns {Wave} текущую волну.
 */
Wave.prototype.move = function () {
  const { products } = this;

  const newProducts = products.map((product) => product.move(product.x, product.y + 1));

  this.products = newProducts;

  return this;
};

/**
 * Обновляет
 * @param productId
 */
Wave.prototype.update = function (productId) {
  const { callbacks } = this;

  if (helpers.isNumeric(productId)) {
    this._removeProducts([productId]);
  } else {
    const deleteProducts = this._checkProducts();

    if (deleteProducts.length) {
      this._removeProducts(deleteProducts);

      callbacks.updateStats &&
        callbacks.updateStats(constants.statsType.LIVES, { count: deleteProducts.length });
    }
  }
};

/**
 * Функция проверки позиций товаров относительно нижней границы игрового поля.
 * Если товар полностью зашёл за нижнюю границу игрового поля, то его Id
 * добавляется в массив товаров, которые готовы к удалению.
 * @returns {*[]} массив id-ов готовых к удалению товаров волны.
 */
Wave.prototype._checkProducts = function () {
  const { products, canvas } = this;

  const deleteProductsIds = [];
  
  products.forEach((product) => {
    if (product.y > canvas.countCellsInHeight) {
      deleteProductsIds.push(product.id);
    }
  });

  return deleteProductsIds;
};

/**
 * Функция, которая задаёт новый список id-ов товаров волны.
 * В результирующий список попадают те товары,
 * id-ки которых не входят в переданный список ids.
 * @param ids список фильтруемых id-ов.
 */
Wave.prototype._removeProducts = function (ids) {
  const { products } = this;

  const newProducts = products.filter(({ id }) => !ids.includes(id));

  this.products = newProducts;
};

export default Wave;