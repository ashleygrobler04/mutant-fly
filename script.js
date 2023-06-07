const gameArea = document.getElementById("area");
const start = document.getElementById("start");
const btnStart = document.getElementById("btn-start");

let frameId;
const snd = new Audio("./step.mp3");
const jumpSnd = new Audio("./jump.mp3");
const closeSnd = new Audio("./close.mp3");

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Timer {
  constructor() {
    this.startTime = new Date().getTime();
    this.endTime;
    this.elapsed;
    this.paused = false;
  }

  update() {
    if (!this.paused) {
      this.endTime = new Date().getTime();
      this.elapsed = this.endTime - this.startTime;
    }
  }

  restart() {
    this.startTime = new Date().getTime();
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }
}

class GameObject {
  constructor(x) {
    this.x = x;
  }
}

class Player extends GameObject {
  constructor(x) {
    super(x);
    this.moveTime = 680;
    this.score = 0;
  }
}

class Fly extends GameObject {
  constructor(x) {
    super(x);
    this.spawned = true;
  }
}

const collide = (obj1, obj2) => obj1.x === obj2.x;

let timer = new Timer();
const person = new Player(0);
const fly = new Fly(10);
let gameOver = false;

function isGameOver() {
  if (collide(person, fly)) {
    alert(`Game over. You managed to scare ${person.score} flies away.`);
    cancelAnimationFrame(frameId);
    timer.pause();
    snd.pause();
    gameOver = true;
  }
  if (person.x === fly.x - 2) {
    closeSnd.play();
  }
}

function gameLoop() {
  timer.update();
  if (!gameOver) {
    if (timer.elapsed >= person.moveTime) {
      person.x += 1;
      isGameOver();
      snd.currentTime=0;
      snd.play();
      timer.restart();
    }
  }
  frameId = requestAnimationFrame(gameLoop);
}

gameArea.addEventListener("click", (e) => {
  if (fly.x - person.x <= 2) {
    jumpSnd.play();
    fly.x += random(5, 20);
    person.score += 1;
    person.moveTime -= random(10, 25);
  } else {
    alert("Too early.");
  }
});

start.showModal();
gameOver=true;
btnStart.addEventListener("click", (e) => {
    jumpSnd.play();
    gameOver=false;
    start.close();
  });
frameId = requestAnimationFrame(gameLoop);
