import { useState } from 'react';
import PropTypes from 'prop-types';

const DroneInput = ({ addRecord }) => {
  const [timestamp, setTimestamp] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!timestamp || !latitude || !longitude) return;
    addRecord({ timestamp, latitude, longitude });
    setTimestamp('');
    setLatitude('');
    setLongitude('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Timestamp"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
        />
        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};


DroneInput.propTypes = {
    addRecord: PropTypes.func.isRequired,
  };

export default DroneInput;
