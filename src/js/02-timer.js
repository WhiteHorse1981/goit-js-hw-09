import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const inputEl = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const timerDiv = document.querySelector('.timer');
const second = document.querySelector('span[data-seconds]');
const minutes = document.querySelector('span[data-minutes]');
const hours = document.querySelector('span[data-hours]');
const days = document.querySelector('span[data-days]');

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      Notiflix.Notify.failure('Please choose a date in the future');
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
    console.log(selectedDates[0]);
  },
};

flatpickr(inputEl, options);

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

//console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
//console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
//console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

startBtn.addEventListener('click', () => {
  let timer = setInterval(() => {
    let countdown = new Date(inputEl.value) - new Date();
    startBtn.disabled = true;
    if (countdown > 0) {
      let timeObj = convertMs(countdown);
      days.textContent = addLeadingZero(timeObj.days);
      hours.textContent = addLeadingZero(timeObj.hours);
      minutes.textContent = addLeadingZero(timeObj.minutes);
      second.textContent = addLeadingZero(timeObj.seconds);
      if (countdown <= 10000) {
        timerDiv.style.color = 'red';
      }
    } else {
      Notiflix.Notify.success('Countdown finished');
      timerDiv.style.color = 'black';
      clearInterval(timer);
    }
  }, 1000);
});
