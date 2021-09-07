import Canvas from "./canvas";
import Wave from "./wave";

import defaultSettings from "./game-settings";

function Game(customSettings) {
  if (!(this instanceof Game)) {
    return new Game(customSettings);
  }

  if (typeof Game.instance === "object") {
    return Game.instance;
  }

  const combineSettings = { ...defaultSettings, ...customSettings };

  this.canvas = new Canvas(this, combineSettings);

  this.waves = [];
  this.wavesSpeeds = [];

  this.currentWaveTimer = null;
  this.currentWaveSpeed = null;
  this.currentWave = null;

  this.initWaves();

  Game.instance = this;
}

Game.prototype.initWaves = function () {
  const waves = [];
  const wavesSpeeds = []

  for (let i = 0; i < 5; i++) {
    waves.push(new Wave(this));
    wavesSpeeds.push(1000 / (i + 1));
  };

  this.waves = waves;
  this.wavesSpeeds = wavesSpeeds;
  this.currentWave = waves[0];
  this.currentWaveSpeed = wavesSpeeds[0];
};

Game.prototype.start = function () {
  this.startCurrentWave();
};

Game.prototype.switchWave = function () {
  const { waves, wavesSpeeds } = this;

  const nextWaveIdx = waves.findIndex((wave) => wave.length);

  if (nextWaveIdx < 0) {
    return;
  }

  this.currentWave = waves[nextWaveIdx];
  this.currentWaveSpeed = wavesSpeeds[nextWaveIdx];

  this.start();
};

/** Методы текущий волны */

Game.prototype.drawCurrentWave = function () {
  this.canvas.clear()
             .fillBackground()
             .drawGrid();

  this.currentWave.update();
  this.currentWave.draw();
};

Game.prototype.updateCurrentWave = function () {
  this.currentWave.move();
  this.stopCurrentWave();
};

Game.prototype.startCurrentWave = function () {
  this.currentWaveTimer = setInterval(() => {
    console.log('tick');
    this.drawCurrentWave();
    this.updateCurrentWave();
  }, this.currentWaveSpeed);
};

Game.prototype.stopCurrentWave = function () {
  const { currentWave, currentWaveTimer } = this;

  if (!currentWave.length) {
    console.log('stop');
    clearInterval(currentWaveTimer);
    this.switchWave();
  }
};

export default Game;
