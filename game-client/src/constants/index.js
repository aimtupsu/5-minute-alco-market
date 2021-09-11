const level = {
  EASY: "EASY",
  NORMAL: "NORMAL",
  HARD: "HARD",
};

const lives = {
  EASY: 5,
  NORMAL: 3,
  HARD: 1,
};

const waves = {
  EASY: 5,
  NORMAL: 7,
  HARD: 10,
}

const faster = {
  EASY: 1.2,
  NORMAL: 1.4,
  HARD: 1.6,
};

const FIRST_WAVE_SPEED = 1.2;
// Делаем задержку первой волны не равную 0, чтобы дать пользователю подготовиться :)
const FIRST_WAVE_DELAY = 1;

export default {
  level,
  lives,
  waves,
  faster,
  FIRST_WAVE_SPEED,
  FIRST_WAVE_DELAY,
};