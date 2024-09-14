'use strict';
//*  MUST BIND 'this' => callback functions: undefined
//*                   => Event Listeners: DOM Element attached

class Workout {
  date = new Date(); // @Display date
  id = Date.now().toString(36) + Math.random().toString(36).slice(2); // @Panning map to clicked workout

  constructor(coords, distance, duration) {
    this.coords = coords; // @param {Array<number>} - Array of latitude & longitude [lat,lng]
    this.distance = distance; // In km
    this.duration = duration; // In min
  }

  //? Protected method: Subclasses need to inherit it => (Not private)
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase() + this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance; // (min/km)
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); // (km/hr)
    return this.speed;
  }
}

/////////////////////////////////////////////////////////////////////////
// APPLICATION ARCHITECTURE
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  // Needed when getting user's location & submitting form
  #map;
  #mapZoomLevel = 15;
  #mapEvent;
  #workouts = [];

  //! Constructor automatically called upon page load
  constructor() {
    //////////////? GETTING USER POSITION ///////////////
    this.#getposition();

    //////////? GETTING LOCAL STORAGE DATA ///////////
    this.#getLocalStorage();

    ////////? ATTACHING EVENT HANDLERS /////////
    //TODO  Submitting workout form
    form.addEventListener('submit', this.#newWorkout.bind(this));
    //TODO  User changes workout type: Running/Cycling
    inputType.addEventListener('change', this.#toggleElevationField); // 'this' not needed here
    //TODO  Panning map to clicked workout
    containerWorkouts.addEventListener('click', this.#moveToPopup.bind(this));
  }

  //! Getting user's location
  #getposition() {
    if (navigator.geolocation) {
      // Successful, Failed
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this), // loadMap: REGULAR FUNCTION CALL (callback) => 'this' equals undefined => Manually set 'this' keyword to object
        function () {
          alert('Failed to get your current location ⛔');
        }
      );
    }
  }

  //! Successful location => Loading map
  #loadMap(position) {
    const { latitude, longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    // map is ID of element where map renders
    this.#map = L.map('map').setView([latitude, longitude], this.#mapZoomLevel);

    //  Openstreetmap theme style
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //TODO   Handling clicks on map
    this.#map.on('click', this.#showForm.bind(this));

    //TODO  Rendering workouts => Only rendered when map is loaded (Not when page accessed)
    this.#workouts.forEach(work => this.#renderWorkoutMarker(work));
  }

  //! Clicking on Map => Show form
  #showForm(mapE) {
    this.#mapEvent = mapE; // Assign as class property => (Event was created here but actually used on form submission)
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  //! Hiding form
  #hideForm() {
    // Clear inputs
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';

    // Add hidden class to form
    form.classList.add('hidden');
  }
  //! WORKOUT TYPE => Running: Cadence // Cycling: Elevation
  #toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  //! Marking Workouts
  #newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(num => Number.isFinite(num));

    const allPositive = (...inputs) => inputs.every(num => num > 0);

    // Avoid page reloading & marker disappearing
    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    //TODO  Running workout => Create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // Validate data
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs must be positive numbers ⚠️');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    //TODO  Cycling workout => Create running object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      // Validate data
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs must be positive numbers ⚠️');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //TODO  Add new object to workout array
    this.#workouts.push(workout);

    //TODO  Add workout to sidebar list
    this.#renderWorkout(workout);

    //TODO  Add workout marker to map
    this.#renderWorkoutMarker(workout);

    //TODO  Clear input fields & Hide form
    this.#hideForm();

    //TODO  Set Local-storage of all workouts
    this.#setLocalStorage();
  }

  //! Rendering marker on map
  #renderWorkoutMarker(workout) {
    L.marker(workout.coords, {
      riseOnHover: true,
      draggable: true,
    })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false, // Close @ another popup created
          closeOnClick: false, // Close @ User clicks on map
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  //! Rendering Workout on sidebar list
  #renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>`;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;

    //TODO  Inserting as sibling to form tag
    form.insertAdjacentHTML('afterend', html);
  }

  //! Move map to clicked workout
  #moveToPopup(e) {
    const workoutElement = e.target.closest('.workout');

    //TODO  IGNORE if container clicked
    if (!workoutElement) return;

    //TODO  GETTING clicked workout data
    const workout = this.#workouts.find(
      work => work.id === workoutElement.dataset.id
    );

    //TODO  Moving Map
    //@param => Coords[], ZoomLevel, Options{}
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  //! Storing Local Storage Data => Blocking => Small data ONLY (cookies...)
  #setLocalStorage() {
    // @params<STRING> => "Key", "Value to store"
    localStorage.setItem('Workouts', JSON.stringify(this.#workouts));
  }

  //! Retrieving Local Storage Data
  #getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('Workouts')); // Parsing => Array returned

    if (!data) return;

    //TODO  Restoring stored workouts into workouts array
    this.#workouts = data;

    //TODO  Rendering workouts on sidebar => Page reloaded
    // However, Rendering markers happens when map is loaded
    this.#workouts.forEach(work => this.#renderWorkout(work));
  }

  //! Clearing Local Storage & Reloading page
  reset() {
    localStorage.removeItem('Workouts');
    location.reload();
  }
}

const app = new App();
