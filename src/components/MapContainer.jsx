import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import PropTypes from 'prop-types';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 18.5204, // Latitude of Pune, India
  lng: 73.8567  // Longitude of Pune, India
};

const MapContainer = ({ records }) => {
  const [map, setMap] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (map && records.length > 1) {
      const sortedRecords = [...records].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const bounds = new window.google.maps.LatLngBounds();
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
            const polyline = new window.google.maps.Polyline({
              path: path,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 4,
              map: map
            });
            map.fitBounds(bounds);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    }
  }, [map, records]);

  const onLoad = (map) => {
    setMap(map);
  };

  const handleMarkerClick = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseInfoWindow = () => {
    setSelectedRecord(null);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
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
      </GoogleMap>
    </LoadScript>
  );
};

MapContainer.propTypes = {
  records: PropTypes.arrayOf(PropTypes.shape({
    timestamp: PropTypes.string,
    latitude: PropTypes.string,
    longitude: PropTypes.string,
  })).isRequired,
};

export default MapContainer;
