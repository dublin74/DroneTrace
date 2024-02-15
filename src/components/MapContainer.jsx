import { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import PropTypes from 'prop-types';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const initialCenter = {
  lat: 18.5204, // Default Latitude of Pune, India
  lng: 73.8567  // Default Longitude of Pune, India
};

const MapContainer = ({ records }) => {
  const [map, setMap] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const mapCenter = useRef(initialCenter);
  const mapZoom = useRef(10);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (map && records.length > 0) {
      const lastRecord = records[records.length - 1];
      mapCenter.current = {
        lat: parseFloat(lastRecord.latitude),
        lng: parseFloat(lastRecord.longitude)
      };
    }
  }, [map, records]);

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
