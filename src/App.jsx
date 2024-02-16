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
      <DroneInput addRecord={addRecord} />
      <MapContainer records={records} />
    </div>
  );
};

export default App;