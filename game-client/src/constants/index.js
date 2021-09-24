const level = {
  EASY: "EASY",
  NORMAL: "NORMAL",
  HARD: "HARD",
};

const lives = {
  EASY: 5,
  NORMAL: 4,
  HARD: 3,
};

const waves = {
  EASY: 5,
  NORMAL: 7,
  HARD: 9,
}

const faster = {
  EASY: 1.2,
  NORMAL: 1.3,
  HARD: 1.4,
};

const statsType = {
  LIVES: "LIVES",
  SCORE: "SCORE",
};

const FIRST_WAVE_SPEED = 1.2;
const WAVE_DELAY = 2;
const ONE_ITERATION = 1000;

export default {
  level,
  lives,
  waves,
  faster,
  statsType,
  FIRST_WAVE_SPEED,
  WAVE_DELAY,
  ONE_ITERATION,
};