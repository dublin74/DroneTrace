import { useState } from 'react';
import DroneInput from './components/DroneInput';
import MapContainer from './components/MapContainer';

const App = () => {
  const [records, setRecords] = useState([]);

  const addRecord = (record) => {
    setRecords([...records, record]);
  };

  return (
    <div>
      <DroneInput addRecord={addRecord} />
      <MapContainer records={records} />
    </div>
  );
};

export default App;