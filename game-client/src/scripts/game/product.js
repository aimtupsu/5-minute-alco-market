/**
 * Функция создания и инициализации товара на игровом поле.
 * Точкой товара с координатами является левая верхняя точка ячейки, которую он занимает.
 *
 * @param id    идентификатор товара;
 * @param image картинка товара;
 * @param x     начальная координата на оси-X товара на игровом поле
 * @param y     начальная координата на оси-Y товара на игровом поле
 * @returns {Product} новый, проинициализированный товар.
 */
function Product(id, image, x, y) {
  if (!(this instanceof Product)) {
    return new Product(id, image, x, y);
  }

  this.x;
  this.y;
  this.id = id;
  this.image = image;

  this.move(x, y);
}

/**
 * Функция перемещения товара из текущей точки в точку (x,y).
 * @param x координата нового положения товара по оси-X;
 * @param y координата нового положения товара по оси-Y;
 * @returns {Product} текущий товар в новой точке игрового поля.
 */
Product.prototype.move = function (x, y) {
  this.x = x;
  this.y = y;

  return this;
};

/**
 * Функция отрисовки текущего товара на игровом поле.
 * @param canvas игровое поле.
 * @returns {Product} текущий товар.
 */
Product.prototype.draw = function (canvas) {
  const { image } = this;
  const { context, cellSize } = canvas;

  const x = this.x * cellSize,
        y = this.y * cellSize;

  // context.fillStyle = "#000";
  // context.fillRect(x, y, cellSize, cellSize);

  context.drawImage(image, x, y, cellSize, cellSize);

  return this;
};

export default Product;
