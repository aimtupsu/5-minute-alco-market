const random = Math.random,
      floor = Math.floor,
      slice = Array.prototype.slice,
      round = Math.round,
      min = Math.min,
      max = Math.max,
      abs = Math.abs;

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

function getMinInArray(array) {
  return min.apply(null, array);
}

function getMaxInArray(array) {
  return max.apply(null, array);
}

function isNumeric(number) {
  return !isNaN(number) && isFinite(number);
}

function loadImageSource(source) {
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = `${window.location.origin}/${source}`;
  });
};

export default {
  getRandomNumber,
  getMinInArray,
  getMaxInArray,
  isNumeric,
  asArray,
  round,
  floor,
  abs,
  loadImageSource,
};
