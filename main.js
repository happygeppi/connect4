const DEPTH = 7;
const WIDTH = 7;
const HEIGHT = 6;

const COLORS = {
  draw: "#116",
  red: "#f00",
  yellow: "#ff0",
};

const PLAYERS = {
  1: {
    color: COLORS.red,
    player: "human",
  },
  2: {
    color: COLORS.yellow,
    player: "computer",
  },
};

let GAME;

function InitGame() {
  document.querySelector("main").remove();
  GAME = new Game(WIDTH, HEIGHT, DEPTH, PLAYERS);
}

const $ = (id) => document.getElementById(id);
$("switch-colors").addEventListener("click", SwitchColors);
$("coin-top").addEventListener("click", ThrowCoin);

function SwitchColors() {
  if ($("coin-content").classList.contains("animation")) return;

  if ($("human").classList.contains("red")) {
    $("human").classList.remove("red");
    $("human").classList.add("yellow");
    $("computer").classList.add("red");
    $("computer").classList.remove("yellow");
  } else {
    $("human").classList.add("red");
    $("human").classList.remove("yellow");
    $("computer").classList.remove("red");
    $("computer").classList.add("yellow");
  }

  const temp = PLAYERS[1].color;
  PLAYERS[1].color = PLAYERS[2].color;
  PLAYERS[2].color = temp;
}

function ThrowCoin() {
  if ($("coin-content").classList.contains("animation")) return;

  let start = 1 + (Math.random() < 0.5);

  const offset = 0.5 * (PLAYERS[start].color == COLORS.yellow);
  $("coin-content").style.setProperty("--x", 5 + offset);
  $("coin-content").style.setProperty("--z", -2 + offset);
  $("coin-content").classList.add("animation");

  $("coin-top").remove();

  if (start == 2) {
    const temp = { color: PLAYERS[1].color, player: PLAYERS[1].player };
    PLAYERS[1] = { color: PLAYERS[2].color, player: PLAYERS[2].player };
    PLAYERS[2] = { color: temp.color, player: temp.player };
  }

  const t = getComputedStyle($("coin-content")).getPropertyValue("--t");
  setTimeout(InitGame, 1000 * (parseInt(t) + 1));
}
