const refs = {
  startButton: document.querySelector('[data-start]'),
  stopButton: document.querySelector('[data-stop]'),
};

let intervalBodyBackgroundColorChange = null;

refs.stopButton.setAttribute('disabled', true);

const getRandomHexColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padEnd(6, '0')}`;

const changeBodyBackgroundColor = () => (document.body.style.backgroundColor = getRandomHexColor());

const switchIntervalState = isActive => {
  if (isActive === true) {
    changeBodyBackgroundColor();
    intervalBodyBackgroundColorChange = setInterval(changeBodyBackgroundColor, 1000);
    return;
  }
  if (isActive === false) clearInterval(intervalBodyBackgroundColorChange);
};

const toggleButtonsState = () => {
  refs.startButton.toggleAttribute('disabled');
  refs.stopButton.toggleAttribute('disabled');
};

const onStartButtonClick = () => {
  switchIntervalState(true);
  toggleButtonsState();
};

const onStopButtonClick = () => {
  switchIntervalState(false);
  toggleButtonsState();
};

refs.startButton.addEventListener('click', onStartButtonClick);
refs.stopButton.addEventListener('click', onStopButtonClick);
