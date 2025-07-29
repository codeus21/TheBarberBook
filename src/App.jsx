import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import BarberProfile from './pages/BarberProfile';
import Header from './components/Header';
import Footer from './components/Footer';
import Booker from './pages/Booker';
import Confirmation from './pages/Confirmation';

function App() {

  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/barber-profile" element={<BarberProfile />} />
        <Route path="/booker" element={<Booker/>}/>
        <Route path="/confirmation" element={<Confirmation/>}/>
        {/* Add more routes as needed */}
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
