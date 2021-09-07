const random = Math.random,
      floor = Math.floor,
      slice = Array.prototype.slice,
      round = Math.round;

function asArray(object, offset) {
  return slice.call(object, offset || 0);
}

function getRandomNumber(min, max, exclude = []) {
  const randomNumber = min + floor((max - min + 1) * random());

  if (exclude.includes(randomNumber)) {
    return getRandomNumber(min, max, exclude);
  }

  return randomNumber;
}

export default {
  getRandomNumber,
  asArray,
  round,
};
