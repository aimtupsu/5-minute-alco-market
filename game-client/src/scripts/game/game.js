import Field from "./field";
import Canvas from "./canvas";
import Cell from "./cell";

import mathHelpers from "../helpers/math";

import defaultSettings from "./game-settings";

function Game(customSettings) {
  if (!(this instanceof Game)) {
    return new Game(customSettings);
  }

  if (typeof Game.instance === "object") {
    return Game.instance;
  }

  const combineSettings = { ...defaultSettings, ...customSettings };

  this.field = new Field(combineSettings);
  this.canvas = new Canvas(combineSettings);

  Game.instance = this;
}

Game.prototype.test = function () {
  const positions = this.field.getInitialRandomPosition();

  console.log("positions", positions);

  positions.forEach((value) => {
    const product = new Cell(value.x, value.y);

    this.canvas.context.fillStyle = "#000";

    product.drawSquareCell(this);
  });
};

export default Game;
