# Mapty 🗺️

**Mapty** is a web-based application that allows users to track their running and cycling workouts by pinpointing locations on a map. The app uses the **Leaflet library** for rendering maps and markers and leverages the **Geolocation API** to capture the user's current position. Workouts are stored in **local storage**, ensuring they persist between sessions.

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapty - Leaflet Map with GeoJSON</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <style>
        #map {
            height: 500px;
            width: 100%;
        }
    </style>
</head>
<body>

    <h1>Mapty - Leaflet Map</h1>
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script>
        // Initialize the map and set its view to the specified coordinates and zoom level
        const map = L.map('map').setView([10.1, 125.6], 13); // [latitude, longitude]

        // Add the tile layer from OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Define the corrected GeoJSON data (coordinates order: [longitude, latitude])
        const geojsonData = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [125.6, 10.1] // [longitude, latitude]
                    },
                    "properties": {
                        "name": "Dinagat Islands"
                    }
                }
            ]
        };

        // Add the GeoJSON layer to the map
        L.geoJSON(geojsonData).addTo(map);
    </script>

</body>
</html>
```
## Features 🌟

- **Leaflet Map Integration**: Display maps and allow users to mark workout locations.
- **Geolocation API**: Automatically detect and display the user’s current location on the map.
- **Local Storage API**: Workouts are saved locally, and users can retrieve their data on their next login.
- **Running & Cycling Workouts**: Users can log their workouts (either running or cycling) with additional data like distance, time, and cadence.
- **Form-Based Input**: A workout form is displayed when a location is clicked on the map, where users can input workout data.
- **Move to Marker**: Click on a workout in the workout list to move the map to the corresponding marker location.

## Demo 📽️
**Interactive Mapty Demo:** [Explore now](https://mostafa-ehab22.github.io/Mapty-Workout-Tracker/)

## Key Components 🔑
- **OOP Architecture:** Manage workout data efficiently with the App & Workout classes.
- **Geolocation API:** Used to get the user's current position.
- **Leaflet.js:** To render maps and manage workout markers.
- **Local Storage:** Saves workout data to be retrieved across sessions.

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
- Input the details such as *distance*, *time* and *cadence (for running)* or *elevation gain (for cycling)*.

### View saved workouts:
Your workouts will be listed on the side and can be clicked to center the map on the workout marker.

### Data persistence:
Close the app and come back later—your workouts will still be there, thanks to **localStorage**!

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

- **Jonas Schmedtmann**: Inspiration and teaching the concepts used in this project.
- **Leaflet Library**: Providing mapping capabilities essential for this project.
