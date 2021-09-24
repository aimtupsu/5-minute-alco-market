import "./scripts/helpers/global";

import "./assets/sass/styles.scss";

import Game from "./scripts/game/game";

window.onload = () => {
  window.game = new Game();
};
