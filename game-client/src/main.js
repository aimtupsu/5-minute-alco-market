import "./scripts/webcoket/websocket";
import "./assets/sass/styles.scss";

import Game from "./scripts/game/game";

window.onload = () => {
  const game = new Game();

  game.test();

  console.log("game: ", game);
};
