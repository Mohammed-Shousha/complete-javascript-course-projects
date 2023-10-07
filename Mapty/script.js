'use strict';

// Data
class Workout {
  date = new Date();
  id = '' + Date.now();

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // km
    this.duration = duration; // min
  }

  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this.description = `${this.type.replace(
      this.type[0],
      this.type[0].toUpperCase()
    )} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence; // steps/min
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation; // meter
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// App
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  #workouts = [];
  #mapZoomLevel = 13;

  constructor() {
    this.#getPosition();

    this.#getLocalStorage();

    form.addEventListener('submit', this.#newWorkout.bind(this));
    inputType.addEventListener('change', this.#toggleElevationField);
    containerWorkouts.addEventListener('click', this.#moveToWorkout.bind(this));
  }

  #getPosition() {
    navigator.geolocation?.getCurrentPosition(this.#loadMap.bind(this), error =>
      this.#showError(error.message)
    );
  }

  #loadMap(position) {
    const { latitude, longitude } = position.coords;

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this.#showForm.bind(this));

    this.#workouts.forEach(w => {
      this.#renderWorkoutMarker(w);
    });
  }

  #showError(message) {
    alert(message);
  }

  #showForm(mapEvent) {
    this.#mapEvent = mapEvent;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  #hideForm() {
    form.classList.add('hidden');

    // clearing input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
  }

  #toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  #newWorkout(event) {
    const areNumbers = (...inputs) => inputs.every(inp => Number.isFinite(inp));

    const arePositive = (...inputs) => inputs.every(inp => inp > 0);

    event.preventDefault();

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    const { lat, lng } = this.#mapEvent.latlng;

    let workout;

    if (!areNumbers(distance, duration) || !arePositive(distance, duration)) {
      return this.#showError('Inputs have to be positive numbers!');
    }

    if (type === 'running') {
      const cadence = +inputCadence.value;

      if (!areNumbers(cadence) || !arePositive(cadence))
        return this.#showError('Inputs have to be positive numbers!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (!areNumbers(elevation))
        return this.#showError('Inputs have to be positive numbers!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    this.#workouts.push(workout);

    this.#renderWorkoutMarker(workout);

    this.#renderWorkout(workout);

    this.#hideForm();

    this.#setLocalStorage();
  }

  #renderWorkoutMarker(workout) {
    const { coords, type, description } = workout;

    L.marker(coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${type}-popup`,
        })
      )
      .setPopupContent(`${type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${description}`)

      .openPopup();
  }

  #renderWorkout(workout) {
    const {
      id,
      type,
      description,
      distance,
      duration,
      pace,
      cadence,
      speed,
      elevation,
    } = workout;

    let workoutTile = `
      <li class="workout workout--${type}" data-id="${id}">
        <h2 class="workout__title">${description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (type === 'running')
      workoutTile += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;

    if (type === 'cycling')
      workoutTile += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${elevation}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;

    form.insertAdjacentHTML('afterend', workoutTile);
  }

  #moveToWorkout(event) {
    if (!this.#map) return;

    const workoutEl = event.target.closest('.workout');

    if (!workoutEl) return;

    const workout = this.#workouts.find(w => w.id === workoutEl.dataset.id);

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  #setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  #getLocalStorage() {
    const workouts = JSON.parse(localStorage.getItem('workouts'));

    if (!workouts) return;

    this.#workouts = workouts;

    this.#workouts.forEach(w => {
      this.#renderWorkout(w);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
