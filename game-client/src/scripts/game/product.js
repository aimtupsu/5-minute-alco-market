function Product(x, y) {
  if (!(this instanceof Product)) {
    return new Product(x, y, moveDelay);
  }

  this.x;
  this.y;

  this.move(x, y);
}

Product.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;

  return this;
};

Product.prototype.draw = function (canvas) {
  const { context, cellSize } = canvas;

  const x = this.x * cellSize,
        y = this.y * cellSize;

  context.fillStyle = "#000";
  context.fillRect(x, y, cellSize, cellSize);

  return this;
};

export default Product;
