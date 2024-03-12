import { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { getDistance } from 'geolib';
import PropTypes from 'prop-types';

const containerStyle = {
  width: '100%',
  height: '80vh'
};

const initialCenter = {
  lat: 18.5204, 
  lng: 73.8567  
}

const MapContainer = ({ records }) => {
  const [map, setMap] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const mapCenter = useRef(initialCenter);
  const mapZoom = useRef(5);
  const [directions, setDirections] = useState(null);
  const [dronePosition, setDronePosition] = useState(null);
  const [animationStatus, setAnimationStatus] = useState('stopped');
  const droneSpeed = useRef(15); // for controlling the default speed of the drone animation
  const dronePathIndex = useRef(0);

  useEffect(() => {
    if (map && (records.length > 0 || dronePosition)) {
      const lastRecord = records[records.length - 1];
      mapCenter.current = dronePosition || {
        lat: parseFloat(lastRecord.latitude),
        lng: parseFloat(lastRecord.longitude)
      };
    }
  }, [map, records, dronePosition]);

  useEffect(() => {
    if (animationStatus === 'playing' && directions) {
      const dronePath = directions;
      const droneMovement = setInterval(() => {
        if (dronePath[dronePathIndex.current]) {
          setDronePosition(dronePath[dronePathIndex.current]);
          dronePathIndex.current++;
          if (dronePathIndex.current < dronePath.length) {
            const distance = getDistance(
              { latitude: dronePath[dronePathIndex.current - 1].lat, longitude: dronePath[dronePathIndex.current - 1].lng },
              { latitude: dronePath[dronePathIndex.current].lat, longitude: dronePath[dronePathIndex.current].lng }
            ); // in meters
            const currentTime = new Date(records[dronePathIndex.current - 1].timestamp);
            const nextTime = new Date(records[dronePathIndex.current].timestamp);
            const timeDifference = nextTime - currentTime; 
            // Adjusting the drone speed based on the distance and time difference - accounting for variable speed
            droneSpeed.current = distance / timeDifference ;  
          }
        } else {
          clearInterval(droneMovement);
          setAnimationStatus('stopped');
        }
      }, 10000 / droneSpeed.current);
      return () => clearInterval(droneMovement);
    }
  }, [animationStatus, directions, records]);

  const handlePlayClick = () => {
    setAnimationStatus('playing');
  };

  const handlePauseClick = () => {
    setAnimationStatus('paused');
    droneSpeed.current = 5;
  };

  const handleResetClick = () => {
    setAnimationStatus('stopped');
    setDronePosition(null);
    dronePathIndex.current = 0;
    droneSpeed.current = 5; // Resetting to the initial default speed
  };

  useEffect(() => {
    if (map && records.length > 1) {
      const sortedRecords = [...records].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      //const bounds = new window.google.maps.LatLngBounds();
      const directionsService = new window.google.maps.DirectionsService();

      const waypoints = sortedRecords.map(record => ({
        location: new window.google.maps.LatLng(parseFloat(record.latitude), parseFloat(record.longitude)),
        stopover: true
      }));

      const origin = waypoints.shift().location;
      const destination = waypoints.pop().location;

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const path = result.routes[0].overview_path;
            setDirections(path);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    }
  }, [map, records]);

  const onLoad = (map) => {
    setMap(map);
    if (map && records.length > 0) {
      map.setCenter(mapCenter.current);
      mapZoom.current = map.getZoom();
    }
  };
  
  const handleMarkerClick = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseInfoWindow = () => {
    setSelectedRecord(null);
  };

  return (
    <div className='map-container'>
      <LoadScript
      googleMapsApiKey={import.meta.env.VITE_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter.current}
        zoom={mapZoom.current}
        onLoad={onLoad}
        onCenterChanged={() => {
          if (map) {
            mapCenter.current = map.getCenter();
          }
        }}
        onZoomChanged={() => {
          if (map) {
            mapZoom.current = map.getZoom();
          }
        }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          rotateControl: false,
          scaleControl: false,
          zoomControl: false,
        }}
      >
        {records.map((record, index) => (
          <Marker
            key={index}
            position={{ lat: parseFloat(record.latitude), lng: parseFloat(record.longitude) }}
            onClick={() => handleMarkerClick(record)}
            icon={{
              url: `https://maps.google.com/mapfiles/ms/icons/${index === 0 ? 'green' : index === records.length - 1 ? 'red' : 'blue'}-dot.png`
            }}
          >
            {selectedRecord === record && (
              <InfoWindow onCloseClick={handleCloseInfoWindow}>
                <div>
                  <p>{index === 0 ? 'Starting Point' : index === records.length - 1 ? 'Destination Point' : 'Intermediate Point'}</p>
                  <p>Timestamp: {record.timestamp}</p>
                  <p>Latitude: {record.latitude}</p>
                  <p>Longitude: {record.longitude}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
        {directions && (
          <Polyline
            path={directions}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}
        {dronePosition && <Marker position={dronePosition} label={{
            text: "Drone-1",
            color: "black",
            fontWeight: "bold",
            fontSize: "16px"
          }} 
          icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png' }} 
          />}
      </GoogleMap>
      <div className='map-controls'>
        <button onClick={handlePlayClick}>Play</button>
        <button onClick={handlePauseClick}>Pause</button>
        <button onClick={handleResetClick}>Reset</button>
      </div>
    </LoadScript>
    </div>
  );
};

MapContainer.propTypes = {
  records: PropTypes.arrayOf(PropTypes.shape({
    timestamp: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  })).isRequired,
};

export default MapContainer;
