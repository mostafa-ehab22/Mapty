# Mapty 🗺️

**Mapty** is a web-based application that allows users to track their running and cycling workouts by pinpointing locations on a map. The app uses the [Leaflet](https://leafletjs.com/) library for rendering maps and markers and leverages the **Geolocation API** to capture the user's current position. Workouts are stored in **local storage**, ensuring they persist between sessions.

## Features 🌟

- **Geolocation API**: Automatically detect and display the user’s current location on the map.
- **Leaflet Map Integration**: Display maps and allow users to mark workout locations.
- **Running & Cycling Workouts**: Users can log their workouts (either running or cycling) with additional data like distance, time, and cadence.
- **Local Storage**: Workouts are saved locally, and users can retrieve their data on their next login.
- **Form-Based Input**: A workout form is displayed when a location is clicked on the map, where users can input workout data.
- **Move to Marker**: Click on a workout in the workout list to move the map to the corresponding marker location.

## Demo 📽️


## Technologies Used 🛠️

- **HTML5**
- **CSS3**
- **JavaScript ES6**
- **Leaflet** for map rendering
- **Geolocation API** for user location
- **localStorage** for data persistence
  
## How to Use 🏃‍♂️🚴‍♀️

### Start the app:
The map will center on your current location using the **Geolocation API**.

### Add a workout:
- Click anywhere on the map to bring up the workout form.
- Select either **Running** or **Cycling**.
- Input the details such as distance, time and cadence (for running) or elevation gain (for cycling).

### View saved workouts:
Your workouts will be listed on the side and can be clicked to center the map on the workout marker.

### Data persistence:
Close the app and come back later—your workouts will still be there, thanks to **localStorage**!

## Key Components 🔑
- **App & Workout Classes:** Object-oriented architecture to handle workout data efficiently.
- **Geolocation API:** Used to get the user's current position.
- **Leaflet.js:** To render maps and manage workout markers.
- **Local Storage:** Saves workout data to be retrieved across sessions.

## Installation 📦

To run this project locally, follow these steps:

1. **Clone the repository:**
```
git clone https://github.com/yourusername/mapty.git
```
2. **Open the project folder:**
```
cd mapty
```
3. **Run the project:** Open ```index.html``` in your web browser using live-server:
```
live-server
```

## Acknowledgments 🙌

- **Jonas Schmedtmann**: For the project inspiration.
- **Leaflet Library**: [LeafletJS documentation](https://leafletjs.com/)
- **Geolocation API**: [Geolocation API documentation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
