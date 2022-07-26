import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  dateTimePickerField: document.querySelector('input#datetime-picker'),
  stratCountdownButton: document.querySelector('[data-start]'),
  stopCountdownButton: document.querySelector('[data-stop]'),
  daysField: document.querySelector('[data-days]'),
  hoursField: document.querySelector('[data-hours]'),
  minutesField: document.querySelector('[data-minutes]'),
  secondsField: document.querySelector('[data-seconds]'),
};

let choosenDate = null;
let intervalCoundown = null;

Notify.init({
  position: 'right-bottom',
  distance: '20px',
  clickToClose: true,
  cssAnimationStyle: 'from-right',
  fontSize: '14px',
  failure: {
    background: '#ff4432',
  },
  warning: {
    textColor: '#000',
  },
});

const dateTimePickerOptions = {
  enableTime: true,
  time_24hr: true,
  dateFormat: 'M d, Y  H:i',
  minuteIncrement: 1,
  onClose([selectedDate]) {
    if (!selectedDate) {
      refs.stratCountdownButton.setAttribute('disabled', true);
      Notify.warning('Please choose a Date!');
      return;
    }
    if (selectedDate < Date.now()) {
      refs.stratCountdownButton.setAttribute('disabled', true);
      Notify.failure('Please choose Date in the future!');
      return;
    }
    choosenDate = selectedDate;
    refs.stratCountdownButton.removeAttribute('disabled');
  },
};

flatpickr(refs.dateTimePickerField, dateTimePickerOptions);

const addLeadingZero = value => value.toString().padStart(2, '0');

const convertMs = ms => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
};

const updateTimerFields = () => {
  const remainTime = choosenDate - Date.now();

  if (remainTime <= 0) {
    stopCoundown();
    Notify.success('Countdown successfully finished!');
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(remainTime);

  refs.daysField.textContent = addLeadingZero(days);
  refs.hoursField.textContent = addLeadingZero(hours);
  refs.minutesField.textContent = addLeadingZero(minutes);
  refs.secondsField.textContent = addLeadingZero(seconds);
};

const toggleControlElementsState = () => {
  refs.dateTimePickerField.toggleAttribute('disabled');
  refs.stratCountdownButton.toggleAttribute('disabled');
  refs.stopCountdownButton.toggleAttribute('disabled');
};

const resetFields = () => {
  refs.daysField.textContent = '00';
  refs.hoursField.textContent = '00';
  refs.minutesField.textContent = '00';
  refs.secondsField.textContent = '00';
};

const startCountdown = () => {
  updateTimerFields();
  intervalCoundown = setInterval(updateTimerFields, 1000);
  toggleControlElementsState();
};

const stopCoundown = () => {
  clearInterval(intervalCoundown);
  resetFields();
  toggleControlElementsState();
};

const onStartButtonClick = () => {
  const currentDate = Date.now();

  if (choosenDate < currentDate) {
    Notify.failure('Choosen Date is reached!');
    return;
  }

  startCountdown();
  Notify.info('Countdown started.');
};

const onStopButtonClick = () => {
  stopCoundown();
  Notify.info('Countdown stopped.');
};

refs.stratCountdownButton.addEventListener('click', onStartButtonClick);
refs.stopCountdownButton.addEventListener('click', onStopButtonClick);
