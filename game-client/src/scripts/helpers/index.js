const random = Math.random,
      floor = Math.floor,
      slice = Array.prototype.slice,
      round = Math.round,
      min = Math.min,
      max = Math.max,
      abs = Math.abs;

/**
 * Возвращает массив объектов, который был получен из переменных/полей переданного объекта
 * с некоторым смещением по массиву.
 * @param object объект, из которого достаются переменные
 * @param offset смещение.
 * @returns {T[]} список атрибутов объекта.
 */
function asArray(object, offset) {
  return slice.call(object, offset || 0);
}

/**
 * Возвращает новое рандомное целое число, которого нет среди списка исключений.
 * Если очередное сгенерированное случайное число всё таки есть в списке ислючений, \
 * то пытаемся сгенерировать новое число.
 * Генерация нового происходит рекурсивно. Рекурсия останавливается, когда полученное
 * случайное число не входит в список исключений.
 * @param min нижняя граница для случайного числа;
 * @param max верхняя граница для случайного числа;
 * @param exclude список исключений.
 * @returns {*} новое случайное число, которого нет среди исключений.
 */
function getRandomNumber(min, max, exclude = []) {
  const randomNumber = min + floor((max - min + 1) * random());

  if (exclude.includes(randomNumber)) {
    return getRandomNumber(min, max, exclude);
  }

  return randomNumber;
}

/**
 * Возвращает минимальное значение из переданного массива.
 * @param array массив значений.
 * @returns {number} минимальное значение из массива.
 */
function getMinInArray(array) {
  return min.apply(null, array);
}

/**
 * Возвращает максимальное значение из переданного массива.
 * @param array массив значений.
 * @returns {number} максимальное значение из массива.
 */
function getMaxInArray(array) {
  return max.apply(null, array);
}

/**
 * Возвращает true, если переданное значение является числом, иначе false.
 * @param number проверяемое значение.
 * @returns {boolean} true, если переданное значение является числом, иначе false.
 */
function isNumeric(number) {
  return !isNaN(number) && isFinite(number);
}

/**
 * Асинхронно загружает картинку.
 * @param source источник картинки.
 * @returns {Promise<unknown>} промис, который загружает картинку.
 */
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
