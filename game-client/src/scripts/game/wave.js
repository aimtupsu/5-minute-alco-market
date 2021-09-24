import Product from "./product";

import helpers from "../helpers";

import constants from "../../constants";

function Wave(canvas, callbacks = {}) {
  if (!(this instanceof Wave)) {
    return new Wave(canvas, callbacks);
  }

  this.canvas = canvas;
  this.callbacks = callbacks;
  this.products = [];

  this._initialize();
}

Wave.prototype._initialize = function () {
  const productsPositions = this._getInitialRandomPosition();
  const products = productsPositions.map((value, index) => new Product(index, value.x, value.y));

  this.products = products;
};

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

Wave.prototype.draw = function () {
  const { canvas, products } = this;

  products.forEach((product) => { product.draw(canvas); });

  return this;
};

Wave.prototype.move = function () {
  const { products } = this;

  const newProducts = products.map((product) => product.move(product.x, product.y + 1));

  this.products = newProducts;

  return this;
};

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

Wave.prototype._removeProducts = function (ids) {
  const { products } = this;

  const newProducts = products.filter(({ id }) => !ids.includes(id));

  this.products = newProducts;
};

export default Wave;