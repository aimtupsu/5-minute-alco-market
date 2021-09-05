const random = Math.random,
      floor = Math.floor,
      slice = Array.prototype.slice,
      round = Math.round;

function asArray(object, offset) {
  return slice.call(object, offset || 0);
}

function getRandomNumber(min, max) {
  return min + floor((max - min + 1) * random());
}

export default {
  getRandomNumber,
  asArray,
  round,
};
