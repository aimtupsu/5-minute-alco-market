import "./scripts/helpers/global";

import "./scripts/webcoket/websocket";
import "./assets/sass/styles.scss";

import Game from "./scripts/game/game";

window.onload = () => {
  const game = new Game();

  console.log('game: ', game);

  game.start();
};
