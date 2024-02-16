import { useState } from 'react';
import PropTypes from 'prop-types';

const DroneInput = ({ addRecord }) => {
  const [timestamp, setTimestamp] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addRecord({ timestamp, latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
    setTimestamp('');
    setLatitude('');
    setLongitude('');
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const records = JSON.parse(e.target.result);
        records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        records.forEach(addRecord);
      };
      reader.readAsText(file);
    }
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
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};


DroneInput.propTypes = {
    addRecord: PropTypes.func.isRequired,
  };

export default DroneInput;
