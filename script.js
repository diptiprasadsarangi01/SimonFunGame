const buttons = document.getElementsByClassName('simon-button');
const strict = document.getElementById('link-strict');
const strictIcon = document.getElementById('strict');
const reset = document.getElementById('link-reset');
const steps = document.getElementById('score');
const play = document.getElementById('play');

let isStrict = false;
let audio = [];
let round;
let game;

audio = [
  new Howl({ src: ['https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'] }),
  new Howl({ src: ['https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'] }),
  new Howl({ src: ['https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'] }),
  new Howl({ src: ['https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'] })
];

Array.from(buttons).forEach(button => button.style.opacity = 0.2);

class Game {
  constructor() {
    this.playerTurn = false;
    this.pattern = [];
    this.steps = 1;
  }
}

class Round {
  constructor() {
    game.pattern.push(Math.floor(Math.random() * 4));
    this.patternLength = game.steps;
    this.pattern = game.pattern;
    this.playerPattern = [];
    this.counter = 0;
    this.speed = 1200 - this.patternLength * 20;
  }
}

const newGame = () => {
  game = new Game();
  steps.innerHTML = "01";
  setTimeout(fadeIntro, 250);
  setTimeout(newRound, 2500);
};

const newRound = () => {
  round = new Round();
  showPattern();
  console.log(round.pattern); // HINT
};

const showPattern = () => {
  game.playerTurn = false;
  play.innerHTML = '<i class="fa fa-circle"></i>';

  for (let x = 0; x < round.patternLength; x++) {
    setTimeout(() => buttonGlow(round.pattern[x], 500), round.speed * x);
  }

  setTimeout(() => {
    game.playerTurn = true;
    play.innerHTML = '<i class="fa fa-circle-o"></i>';
  }, round.speed * round.patternLength);
};

const buttonClick = (e) => {
  if (!game.playerTurn) return;
  const buttonIndex = e.target.id;
  round.playerPattern.push(parseInt(buttonIndex));
  buttonGlow(e);
  check();
};

const check = () => {
  if (round.playerPattern[round.counter] === round.pattern[round.counter]) {
    round.counter++;
    if (round.counter === round.patternLength) {
      game.playerTurn = false;
      game.steps++;
      if (game.steps === 21) {
        steps.innerHTML = '<i class="fa fa-trophy"></i>';
        setTimeout(newGame, 4000);
      } else {
        steps.innerHTML = game.steps < 10 ? `0${game.steps}` : game.steps;
        setTimeout(newRound, 1500);
      }
    }
  } else if (isStrict) {
    steps.innerHTML = '<i class="fa fa-exclamation-triangle"></i>';
    setTimeout(newGame, 2000);
  } else {
    game.playerTurn = false;
    round.counter = 0;
    round.playerPattern = [];
    steps.innerHTML = '<i class="fa fa-exclamation-circle"></i>';
    setTimeout(() => {
      steps.innerHTML = game.steps < 10 ? `0${game.steps}` : game.steps;
      showPattern();
    }, 1500);
  }
};

const buttonGlow = (button, delay = 90, fadeSpeed = 90) => {
  const pressed = button.target === undefined ? button : button.target.id;
  buttons[pressed].style.opacity = 1;
  audio[pressed].play();
  setTimeout(() => fade(pressed, fadeSpeed), delay);
};

const toggleStrict = () => {
  isStrict = !isStrict;
  strictIcon.innerHTML = isStrict
    ? '<i class="fa fa-check"></i>'
    : '<i class="fa fa-times"></i>';
};

const fade = (buttonIndex, fadeSpeed) => {
  buttons[buttonIndex].style.opacity -= 0.1;
  if (parseFloat(buttons[buttonIndex].style.opacity) > 0.3) {
    setTimeout(() => fade(buttonIndex, fadeSpeed), fadeSpeed);
  }
};

const fadeIntro = () => {
  Array.from(buttons).forEach((_, i) => {
    setTimeout(() => buttonGlow(i), 400 * i);
  });
};

// Initialization
(() => {
  newGame();
  reset.onclick = newGame;
  strict.onclick = toggleStrict;
  Array.from(buttons).forEach(button => {
    button.onmousedown = buttonClick;
  });
})();
