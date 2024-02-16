# Drone Simulator

This web application allows users to track the movement of a drone on a map by providing timestamps, latitude, and longitude coordinates. It consists of two main components: a form for inputting drone data and a map for visualizing the drone's path.

## Features

- **Drone Input Form**: Users can input timestamps, latitude, and longitude coordinates of the drone's movement via a simple form.

- **Map Visualization**: The drone's movement is visualized on a map using markers and polylines, allowing users to track its path easily.

- **Playback Controls**: Users can control the playback of the drone's movement with play, pause, and reset buttons.

## Usage

1. Clone the repository to your local machine `git clone https://github.com/dublin74/drone-sim-visualizer.git`.
2. Go to the repo folder `cd .\drone-sim-visualizer\`.
3. Install dependencies by running `npm install`.
4. Start the development server with `npm run dev`.
5. Open the application in your web browser at `http://localhost:3000`.

## Technologies Used

- React.js: Frontend framework for building user interfaces.
- Google Maps JavaScript API: Integration for displaying maps and visualizing drone movement.
- @react-google-maps/api: React wrapper for Google Maps API.
- CSS: Styling for the user interface.

## Note

You can click on any marker on the map, and it will open up an info window showing the necessary details like the starting marker(green), intermediate marker(blue) or destination marker(red). Additional information is available, such as the timestamp, latitude, and longitude coordinates for that marker in the info window.

You can change the default speed by changing the variable `droneSpeed` in `MapContainer.jsx`.

I have also added a `text.txt file` containing the format in which data can be uploaded on this website.




