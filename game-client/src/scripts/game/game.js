import Canvas from "./canvas";
import Wave from "./wave";

import layout from "../layout";

import helpers from "../helpers";

import constants from "../../constants";

import texture from '../texture';

import defaultSettings from "./game-settings";

/**
 * Функция создания и инициализации игры.
 * Главная функции игры.
 * @param customSettings настройки игры. Если не заданы, то используются дефолтные.
 * @returns {Game|Game} текущую игру.
 * @constructor
 */
function Game(customSettings) {
  if (!(this instanceof Game)) {
    return new Game(customSettings);
  }

  if (typeof Game.instance === "object") {
    return Game.instance;
  }

  const combineSettings = { ...defaultSettings, ...customSettings };

  this.callbacks = {
    updateStats: this.updateStats.bind(this),
  };

  this.canvas = new Canvas(combineSettings, this.callbacks);

  // Массив волн
  this.waves = [];

  // Индекс текущей волны
  this.currentWaveIndex = null;

  // Делители для частоты отрисовки, будем делить 1 секунду на значение, должен быть > 0
  this.wavesSpeeds = [];

  // Задержка начальной отрисовки волны, в секундах
  this.waveDelay = null;

  // Хранилище таймеров для перерисовки волн
  // Необходимо очищать значение для волны, когда количество элементов в волне закончилось
  this.wavesIntervalTimers = [];

  // Хранилище таймеров для начальной отрисовки волн
  this.wavesTimeoutTimers = [];

  // Уровень сложности игры
  this.level = combineSettings.level;

  // Кол-во жизней
  this.lives = null;

  // Количество очков
  this.score = null;

  this._initialize();

  Game.instance = this;
}

/**
 * Функция инициализации игры.
 * См. комменты в теле функции.
 * @private
 */
Game.prototype._initialize = function () {
  layout.showLoader();

  // Загружаем всё необходимое
  const assets = Object.values(texture.qr).map((qr) => helpers.loadImageSource(qr));

  // После загрузки инициализируем элементы игры и отрисовываем их
  Promise.all(assets).then((images) => {
    const { canvas, callbacks } = this;

    const waves = [],
          wavesSpeeds = [];

    const level = this._level();

    // Задаем начальные значение для первой волны, от нее будем высчитывать значения для других волн
    waves.push(new Wave(canvas, callbacks, images));
    wavesSpeeds.push(constants.FIRST_WAVE_SPEED);

    for (let i = 1; i < level.waves; i++) {
      const speed = wavesSpeeds[i - 1];

      waves.push(new Wave(canvas, callbacks, images));
      wavesSpeeds.push(helpers.round(speed * level.faster * 100) / 100);
    }

    this.waves = waves;
    this.currentWaveIndex = 0;
    this.wavesSpeeds = wavesSpeeds;
    this.waveDelay = constants.WAVE_DELAY;
    this.lives = level.lives;
    this.score = 0;

    canvas.clearAll().drawGrid();

    layout.renderLives(level.waves);
    layout.showMenu();
  })
  .catch(() => {
    layout.showOverlay("При загрузке произошла ошибка!");
  });
};

/**
 * Функция получения информации о текущем уровне игры.
 * @returns {{waves, faster, lives}} информация о текущем уровне игры (кол-во волн, ускорение, кол-во жизней).
 * @private
 */
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

/**
 * Функция запуска игры.
 */
Game.prototype.start = function () {
  this._animate();
};

/**
 * Функция остановки игры.
 */
Game.prototype.stop = function () {
  const { wavesIntervalTimers, wavesTimeoutTimers, score } = this;

  wavesIntervalTimers.forEach(clearInterval);
  wavesTimeoutTimers.forEach(clearTimeout);

  layout.showEnd(score);
};

/**
 * Функция обновления статистики игры и элемент игры.
 * Если входящий тип - LIVES, то выполняется уменьшение кол-во жизней на значение count из параметров.
 * Если входящий тип - SCORE, то выполняется поиск товара по переданным в параметрах координатам
 *  и, если товар будет найден, то кол-во очков игрока будет увеличено.
 * @param type тип статов;
 * @param params параметры для изменения статов.
 */
Game.prototype.updateStats = function (type, params) {
  const { currentWaveIndex, waves, score, lives } = this;

  switch(type) {
    case constants.statsType.LIVES:
      const { count } = params;

      const newLives = lives - count;
      this.lives = newLives;

      if (newLives === 0) {
        this.stop();
      }

      layout.updateLives(count);

      break;

    case constants.statsType.SCORE:
      const wave = waves[currentWaveIndex];

      const { x, y } = params;

      const searchProduct = wave.products.filter((product) => product.x === x && product.y === y)[0];

      if (searchProduct) {
        const newScore = score + currentWaveIndex + 1;
        this.score = newScore;

        wave.update(searchProduct.id);

        layout.renderScore(newScore);
      }

      break;

    default:
      return;
  }
};

/**
 * Функция обновления состояния игры.
 * Если товары в текущей волне кончились, то достаём следующую волну и отрисовываем их.
 * Если волны кончились, то останавливаем игру.
 * Если же товары в текущей волне не кончились, то обновляем её состояние..
 * @private
 */
Game.prototype._update = function () {
  const { waves, wavesIntervalTimers, currentWaveIndex } = this;
  const wave = waves[currentWaveIndex];

  if (!wave.products.length) {
    clearInterval(wavesIntervalTimers[currentWaveIndex]);

    const nextWaveIndex = currentWaveIndex + 1;

    if (nextWaveIndex < waves.length) {
      this.currentWaveIndex = nextWaveIndex;
      this._animate();
    } else {
      this.stop();
      return;
    }

  } else {
    wave.update();
  }
};

/**
 * Функция, которая заставляет двигаться волны в игре.
 * Анимация волны реализована с помощью перерисовки положений товаров волны
 * по таймеру, который срабатывает каждые N раз в секунду, где N задаётся в настройках.
 * На каждый тик таймера двигаются товары волны и перерисовывается полностью всё игровое поле.
 * @private
 */
Game.prototype._animate = function () {
  const {
    wavesTimeoutTimers,
    wavesIntervalTimers,
    currentWaveIndex,
    waves,
    waveDelay,
    wavesSpeeds,
    canvas,
  } = this;

  let timer = null;

  const wave = waves[currentWaveIndex];
  const speed = wavesSpeeds[currentWaveIndex];

  layout.showWave(currentWaveIndex);

  wavesTimeoutTimers.push(timer = setTimeout(() => {
    // Волна запущена, можно очистить таймер
    clearTimeout(timer);

    layout.hideOverlay();

    wavesIntervalTimers.push(setInterval(() => {

    canvas.clearAll().drawGrid();

    wave.draw().move();

    this._update();

    }, helpers.round(constants.ONE_ITERATION / speed)));

  }, constants.ONE_ITERATION * waveDelay));
};

export default Game;
