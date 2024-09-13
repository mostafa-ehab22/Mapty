'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//*     MUST BIND 'this' => callback functions: undefined
//*                      => Event Listeners: DOM Element attached

class App {
  // Needed when getting user's location & submitting form
  #map;
  #mapEvent;

  //! Constructor automatically called upon page load
  constructor() {
    this.#getposition();

    //! Submitting workout form
    form.addEventListener('submit', this.#newWorkout.bind(this));

    //! User changes workout type: Running/Cycling
    inputType.addEventListener('change', this.#toggleElevationField); // 'this' not needed here
  }

  //! Getting user's location
  #getposition() {
    if (navigator.geolocation) {
      // Successful, Failed
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this), // loadMap: REGULAR FUNCTION CALL (callback) => 'this' equals undefined => Manually set 'this' keyword to object
        function () {
          alert('Failed to get your current location 🥺');
        }
      );
    }
  }

  //! Successful location => Loading map
  #loadMap(position) {
    const { latitude, longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    // map is ID of element where map renders
    this.#map = L.map('map').setView([latitude, longitude], 15);

    //  Openstreetmap theme style
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this.#showForm.bind(this));
  }

  //! Showing form
  #showForm(mapE) {
    this.#mapEvent = mapE; // Assign as class property => (Event was created here but actually used on form submission)
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  #toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  //! Marking Workouts
  #newWorkout(e) {
    // Avoid page reloading & marker disappearing
    e.preventDefault();

    // Clear input fields
    // prettier-ignore
    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = '';

    const { lat, lng } = this.#mapEvent.latlng;
    // Adding marker
    L.marker([lat, lng], {
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
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App();
