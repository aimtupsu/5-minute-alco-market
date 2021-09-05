import helpers from ".";

(function (w) {
  Function.prototype.partialRight = function () {
    const fn = this,
      args = helpers.asArray(arguments);

    return function () {
      return fn.apply(this, helpers.asArray(arguments).concat(args));
    };
  };
})(window);
