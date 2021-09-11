import "./scripts/helpers/global";

import "./scripts/webcoket/websocket";
import "./assets/sass/styles.scss";

import Game from "./scripts/game/game";

window.onload = () => {
  const stop = document.getElementById("stop");
  const start = document.getElementById("start");

  const game = new Game();

  console.log('game: ', game);

  game.start();

  stop.addEventListener("click", () => {
    game.stop();
  })

  start.addEventListener("click", () => {
    game.start();
  })
};
