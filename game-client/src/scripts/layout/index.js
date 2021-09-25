import helpers from "../helpers";

const scoreHtml = document.getElementById("score");
const livesHtml = document.getElementById("lives");
const overlayHtml = document.getElementById("overlay");

function renderScore(score) {
  scoreHtml.innerHTML = score;
};

function renderLives(count) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";

    livesHtml.appendChild(heart);
  }
};

function updateLives(count) {
  const hearts = helpers.asArray(livesHtml.children);

  const remainingLives = hearts.filter((heart) => !heart.classList.contains("heart--grey"));

  let counter = count > remainingLives.length ? remainingLives.length : count;

  while (counter > 0) {
    const firstRemainingHeart = hearts.find((heart) => !heart.classList.contains("heart--grey"));

    firstRemainingHeart && firstRemainingHeart.classList.add("heart--grey");

    counter--;
  }
};

function showOverlay(content) {
  overlayHtml.classList.remove("overlay--hide");
  overlayHtml.classList.add("overlay--show");

  overlayHtml.firstElementChild.innerHTML = content;
};

function hideOverlay() {
  overlayHtml.classList.remove("overlay--show");
  overlayHtml.classList.add("overlay--hide");
};

function showMenu() {
  const content =
    `<div class="menu">
      <div class="menu__title">
        Menu
      </div>
      <ul class="menu__list">
        <li onclick="window.game.start()">Start</li>
        <li>Settings</li>
      </ul>
    </div>`;

  showOverlay(content);
};

function showWave(index) {
  const content = `<div class="info">Wave ${index + 1}</div>`;

  showOverlay(content);
};

function showEnd(score) {
  const content =
    `<div class="info">
      <div>Game Over</div>
      <div>Your score ${score}</div>
    </div>`;

  showOverlay(content);
};

function showLoader() {
  const content = `<div class="loader"></div>`;

  showOverlay(content);
};

export default {
  renderScore,
  renderLives,
  updateLives,
  showOverlay,
  hideOverlay,
  showMenu,
  showWave,
  showEnd,
  showLoader,
}