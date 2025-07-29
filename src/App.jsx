import Home from './pages/Home';
import BarberProfile from './pages/BarberProfile';
import { createContext, useState } from 'react';

export const nameContext = createContext();

function App() {
  const [name, setName] = useState('Guest');

  return (
    <>
      <nameContext.Provider value={{ name, setName }}>
        <Home />
      </nameContext.Provider>
      <br/><br/><br/><br/>
      <BarberProfile/>
    </>
  );
}

export default App;
