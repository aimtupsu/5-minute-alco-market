import "./scripts/helpers/global";

import "./scripts/webcoket/websocket";
import "./assets/sass/styles.scss";

import Game from "./scripts/game/game";

window.onload = () => {
  const game = new Game();

  function main() {
    game.draw();
    game.update();
  }

  //setInterval(function () {
    main();
  //}, 1000 / 5);
};
