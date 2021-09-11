import Canvas from "./canvas";
import Wave from "./wave";

import helpers from "../helpers";

import constants from "../../constants";

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

  // Массив волн
  this.waves = [];

  // Делители для частоты отрисовки, будем делить 1 секунду на значение, должен быть > 0
  this.wavesSpeeds = [];

  // Задержки начальной отрисовки волн, в секундах
  this.wavesDelays = [];

  // Хранилище таймеров для перерисовки волн
  // Необходимо очищать значение для волны, когда количество элементов в волне закончилось
  this.wavesIntervalTimers = [];

  // Хранилище таймеров для начальной отрисовки волн
  this.wavesTimeoutTimers = [];

  // Уровень сложности игры
  this.level = combineSettings.level;

  // Кол-во жизней
  this.lives = null;

  this._initialize();

  Game.instance = this;
}

Game.prototype._initialize = function () {
  const { canvas } = this;

  const waves = [],
        wavesSpeeds = [],
        wavesDelays = [];

  const level = this._level();

  // Задаем начальные значение для первой волны, от нее будем высчитывать значения для других волн
  waves.push(new Wave(this));
  wavesSpeeds.push(constants.FIRST_WAVE_SPEED);
  wavesDelays.push(constants.FIRST_WAVE_DELAY);

  for (let i = 1; i <= level.waves; i++) {
    // Берем предыдущую волну
    const wave = waves[i - 1];

    // Находим элемент в волне, который имеет наименьшее значение по оси Y
    const minY = helpers.getMinInArray(wave.products.map((product) => product.y));

    // Находим середину полотна
    const middleCell = canvas.countCellsInHeight / 2;

    // Находим общее количество ячеек которое пройдет верхний элемент
    const totalCells = helpers.abs(minY) + middleCell;

    // Высчитываем время задержки отрисовки волн:
    // Скорость прохождения одной клетки(1 / speed) * общее количество клеток + задержка пред. волны
    const speed = wavesSpeeds[i - 1];
    const delay = wavesDelays[i - 1];
    const waveDelay = helpers.round(1 / speed * totalCells + delay);

    waves.push(new Wave(this));
    wavesDelays.push(waveDelay);
    wavesSpeeds.push(helpers.round(speed * level.faster * 100) / 100);
  };

  this.waves = waves;
  this.wavesSpeeds = wavesSpeeds;
  this.wavesDelays = wavesDelays;
  this.lives = level.lives;
};

Game.prototype._level = function () {
  const { level } = this;
  const { level: lvl, lives, waves, faster } = constants;

  let livesResult,
      wavesResult,
      fasterResult;

  switch (level) {
    case lvl.EASY:
    case lvl.NORMAL:
    case lvl.HARD:
      livesResult = lives[level];
      wavesResult = waves[level];
      fasterResult = faster[level];
      break;

    default:
      livesResult = lives[lvl.EASY];
      wavesResult = waves[lvl.EASY];
      fasterResult = faster[lvl.EASY];
      break;
  }

  return {
    lives: livesResult,
    waves: wavesResult,
    faster: fasterResult,
  };
};

Game.prototype.start = function () {
  const {
    waves,
    wavesDelays,
    wavesSpeeds
  } = this;

  waves.forEach((wave, index) => {
    this._animate(wave, wavesDelays[index], wavesSpeeds[index], index);
  });
};

Game.prototype.stop = function () {
  const { wavesIntervalTimers, wavesTimeoutTimers } = this;

  wavesIntervalTimers.forEach(clearInterval);
  wavesTimeoutTimers.forEach(clearTimeout);
};

Game.prototype.update = function (currentWaveIndex) {
  const { waves, wavesIntervalTimers } = this;

  if (!waves[currentWaveIndex].length) {
    clearInterval(wavesIntervalTimers[currentWaveIndex]);
  }
};

Game.prototype._getWaveBound = function (i) {
  const { waves, canvas } = this;

  const wave = waves[i];
  const prevWave = waves[i - 1];
  const nextWave = waves[i + 1];

  const positionsY = wave.products.map((product) => product.y);

  let min = helpers.getMinInArray(positionsY),
      max = helpers.getMaxInArray(positionsY);

  if (nextWave && nextWave.length) {
    const nextMax = helpers.getMaxInArray(nextWave.products.map((product) => product.y));

    if (helpers.isNumeric(nextMax)) {
      min = nextMax;
    }
  } else {
    min = 0;
  }

  if (prevWave && prevWave.length) {
    const prevMin = helpers.getMinInArray(prevWave.products.map((product) => product.y));

    if (helpers.isNumeric(prevMin)) {

    }
  } else {
    max = canvas.countCellsInHeight;
  }

  return { max, min };
};

Game.prototype.check = function (x, y) {
  const { waves } = this;

  waves.forEach((wave) => {
    wave.products.forEach((product, index) => {
      if (product.x === x && product.y === y) {
        wave.removeProducts([index]);
      }
    });
  });
};

Game.prototype._animate = function (wave, delay, speed, index) {
  const game = this;

  const {
    wavesTimeoutTimers,
    wavesIntervalTimers,
    canvas
  } = game;

  let timer = null;

  wavesTimeoutTimers.push(timer = setTimeout(function () {
    // Волна запущена, можно очистить таймер
    clearTimeout(timer);

    wavesIntervalTimers.push(setInterval(function () {
      const { min, max } = game._getWaveBound(index);

      canvas.clearYRect(min, max).fillYBackground(min, max)// .drawGrid();

      wave.draw();
      wave.move();

      game.update.call(game, index);

      wave.update();
    }, helpers.round(1000 / speed)));

  }, delay * 1000));
};

export default Game;
