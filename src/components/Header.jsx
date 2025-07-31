import { Link } from 'react-router-dom';
import '../css/Header.css'

function Header(){
    return(
        <header className="header">
            <div className="header-container">
                <div>
                    <h1 className="header-title">Clean Cuts</h1>
                    <p className="header-subtitle">Professional Grooming Services</p>
                </div>
                <nav className="header-nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/services" className='nav-link'>Services</Link>
                    <Link to="/reviews" className="nav-link">Reviews</Link>
                    <Link to="/booker" className="nav-link">Book Now</Link>
                </nav>
            </div>
        </header>
    )
}

export default Header;