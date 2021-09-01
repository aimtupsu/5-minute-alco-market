const random = Math.random,
  floor = Math.floor;

function getRandomNumber(min, max) {
  return min + floor((max - min + 1) * random());
}

export default {
  getRandomNumber,
};
