import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formRef = document.querySelector('form.form');

Notify.init({
  distance: '20px',
  clickToClose: true,
  cssAnimationStyle: 'from-right',
  fontSize: '14px',
  delay: 4000,
  failure: {
    background: '#ff4432',
  },
});

class PromiseGenerator {
  #form;
  #onSuccess;
  #onFailure;

  constructor(settings) {
    this.#form = null;
    this.delay = null;
    this.step = null;
    this.amount = null;
    this.#onSuccess = settings?.onSuccess;
    this.#onFailure = settings?.onFailure;
  }

  start(form) {
    this.#form = form;
    if (!this.#form) {
      this.#failureNotification('Target Form not found!');
      return;
    }

    this.#collectFormData();
    if (!this.delay) {
      this.#failureNotification('Delay value not found!');
      return;
    }
    if (!this.step) {
      this.#failureNotification('Step value not found!');
      return;
    }
    if (!this.amount) {
      this.#failureNotification('Amount value not found!');
      return;
    }

    this.#toggleSubmitButtonState();
    this.#createPromisesQueue();
  }

  #collectFormData() {
    const formData = new FormData(this.#form);

    formData.forEach((value, key) => {
      this[key] = Number(value);
    });
  }

  #toggleSubmitButtonState() {
    const submitButtonRef = this.#form.querySelector('[type="submit"]');
    submitButtonRef.toggleAttribute('disabled');
  }

  #createPromisesQueue() {
    let iterationDelay = this.delay;

    for (let i = 1; i <= this.amount; i += 1) {
      this.#createPromise(i, iterationDelay)
        .then(({ position, delay }) => {
          this.#successNotification(`Fulfilled promise ${position} in ${delay}ms`);
        })
        .catch(({ position, delay }) => {
          this.#failureNotification(`Rejected promise ${position} in ${delay}ms`);
        })
        .finally(() => {
          if (i === this.amount) this.#toggleSubmitButtonState();
        });

      iterationDelay += this.step;
    }
  }

  #createPromise(position, delay) {
    return new Promise((resolve, reject) => {
      const shouldResolve = Math.random() > 0.3;

      setTimeout(() => {
        if (shouldResolve) {
          resolve({ position, delay });
        } else {
          reject({ position, delay });
        }
      }, delay);
    });
  }

  #successNotification(message) {
    if (this.#onSuccess) {
      this.#onSuccess(message);
    } else {
      alert(`SUCCESS!\n${message}`);
    }
  }

  #failureNotification(message) {
    if (this.#onFailure) {
      this.#onFailure(message);
    } else {
      alert(`FAILURE!\n${message}`);
    }
  }
}

const promiseGenerator = new PromiseGenerator({
  onSuccess: Notify.success,
  onFailure: Notify.failure,
});

const onFormSubmit = event => {
  event.preventDefault();
  promiseGenerator.start(event.currentTarget);
};

formRef.addEventListener('submit', onFormSubmit);
