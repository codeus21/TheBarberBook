import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BarberProfile from './pages/BarberProfile';
import Header from './components/Header';
import Footer from './components/Footer';
import Booker from './pages/Booker';
import Confirmation from './pages/Confirmation';
import Reviews from './pages/Reviews';
import Services from './pages/Services';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {

  return (
    <Router>
      <Routes>
        {/* Admin routes - no header/footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Public routes - with header/footer */}
        <Route path="/" element={
          <>
            <Header/>
            <BarberProfile />
            <Footer/>
          </>
        } />
        <Route path="/Services" element={
          <>
            <Header/>
            <Services/>
            <Footer/>
          </>
        } />
        <Route path="/reviews" element={
          <>
            <Header/>
            <Reviews/>
            <Footer/>
          </>
        } />
        <Route path="/booker" element={
          <>
            <Header/>
            <Booker/>
            <Footer/>
          </>
        } />
        <Route path="/confirmation" element={
          <>
            <Header/>
            <Confirmation/>
            <Footer/>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
