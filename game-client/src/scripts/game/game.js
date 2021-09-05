import Field from "./field";
import Canvas from "./canvas";
import Cell from "./cell";

import defaultSettings from "./game-settings";

function Game(customSettings) {
  if (!(this instanceof Game)) {
    return new Game(customSettings);
  }

  if (typeof Game.instance === "object") {
    return Game.instance;
  }

  const combineSettings = { ...defaultSettings, ...customSettings };

  this.field = new Field(this, combineSettings);
  this.canvas = new Canvas(this, combineSettings);

  this.products = this.field.getInitialRandomPosition();

  Game.instance = this;
}

Game.prototype.drawProducts = function () {
  this.products.forEach((value) => {
    const product = new Cell(value.x, value.y);
  
    this.canvas.context.fillStyle = "#000";
  
    product.drawSquareCell(this);
  });
};

Game.prototype.moveProducts = function () {
  const newPositions = this.products.map((value) => ({ x: value.x, y: value.y + 1 }));

  this.products = newPositions;
};

Game.prototype.update = function () {
  this.moveProducts();
};

Game.prototype.draw = function () {
  this.canvas.clear();
  this.canvas.fillBackground().drawGrid();
  this.drawProducts();
};

export default Game;
