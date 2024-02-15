import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow} from '@react-google-maps/api';
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
