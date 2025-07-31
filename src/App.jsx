import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BarberProfile from './pages/BarberProfile';
import Header from './components/Header';
import Footer from './components/Footer';
import Booker from './pages/Booker';
import Confirmation from './pages/Confirmation';
import Reviews from './pages/Reviews';
import Services from './pages/Services';

function App() {

  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<BarberProfile />} />
        <Route path="/Services" element={<Services/>} />
        <Route path="/reviews" element={<Reviews/>} /> 
        <Route path="/booker" element={<Booker/>} />
        <Route path="/confirmation" element={<Confirmation/>} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
