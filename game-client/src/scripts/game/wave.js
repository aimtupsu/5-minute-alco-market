import Product from "./product";

import helpers from "../helpers";

function Wave(game) {
  if (!(this instanceof Wave)) {
    return new Wave(game);
  }

  this.game = game;
  this.products = this.createProducts();
  this.length = this.products.length;
}

Wave.prototype.getInitialRandomPosition = function () {
  const { canvas } = this.game;

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

Wave.prototype.createProducts = function () {
  const productsPositions = this.getInitialRandomPosition();

  const products = productsPositions.map((value) => new Product(value.x, value.y));

  return products;
};

Wave.prototype.draw = function () {
  const { canvas } = this.game;

  this.products.forEach((product) => {
    product.draw(canvas);
  });
};

Wave.prototype.move = function () {
  const { products } = this;

  const newProducts = products.map((product) => product.move(product.x, product.y + 1));

  this.products = newProducts;

  return this;
};

Wave.prototype.update = function () {
  this.removeProducts(this._check());
};

Wave.prototype._check = function () {
  const { products } = this;
  const { canvas } = this.game;

  const deleteIndx = [];
  
  products.forEach((product, index) => {
    if (product.y > canvas.countCellsInHeight) {
      deleteIndx.push(index);
    }
  });

  return deleteIndx;
};

Wave.prototype.removeProducts = function (indexes) {
  const { products } = this;

  const newProducts = products.filter((_, index) => !indexes.includes(index));

  this.products = newProducts;
  this.length = newProducts.length;
};

export default Wave;