function Canvas(settings) {
  if (!(this instanceof Canvas)) {
    return new Canvas(settings);
  }

  const {
    canvasWidth,
    canvasHeight,
    canvasContainerId,
    canvasBackgroundColor,
  } = settings;

  this.context = null;
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;
  this.canvasContainerId = canvasContainerId;
  this.canvasBackgroundColor = canvasBackgroundColor;

  this.setContext();
}

Canvas.prototype.renderIntoDOM = function () {
  const canvas = document.createElement("canvas");
  const container = document.getElementById(this.canvasContainerId);

  canvas.width = this.canvasWidth;
  canvas.height = this.canvasHeight;

  if (container) {
    container.appendChild(canvas);
  } else {
    document.body.appendChild(canvas);
  }

  return canvas;
};

Canvas.prototype.setContext = function () {
  this.context = this.renderIntoDOM().getContext("2d");

  // TODO: не относиться к методу - переместить в другое место
  this.context.fillStyle = this.canvasBackgroundColor;
  this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
};

export default Canvas;
