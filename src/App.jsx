import { useState } from 'react';
import DroneInput from './components/DroneInput';
import MapContainer from './components/MapContainer';
import './App.css';

const App = () => {
  const [records, setRecords] = useState([]);

  const addRecord = (record) => {
    setRecords((prevRecords) => [...prevRecords, record]);
  };

  return (
    <div className='base'>
      <div className='drone-input'>
        <DroneInput addRecord={addRecord} />
      </div>
      <div className='map-container'>
        <MapContainer records={records} />
      </div>
    </div>
  );
};

export default App;