import { Link } from 'react-router-dom';
import { getTenantFromUrl } from '../utils/apiHelper.js';
import '../css/Footer.css'

function Footer() {
    const tenant = getTenantFromUrl();
    
    // Helper function to create links with tenant parameter
    const createLink = (path) => {
        return `${path}?tenant=${tenant}`;
    };

    return(
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-title">Contact Us</h3>
                    <p className="footer-text">123 Main Street</p>
                    <p className="footer-text">Phone: 123-456-7890</p>
                    <p className="footer-text">Email: info@thebarberbook.com</p>
                </div>
                
                <div className="footer-section">
                    <h3 className="footer-title">Services</h3>
                    <Link to={createLink("/services")} className="footer-link">Haircuts</Link>
                    <Link to={createLink("/services")} className="footer-link">Beard Trims</Link>
                    <Link to={createLink("/services")} className="footer-link">Shaves</Link>
                    <Link to={createLink("/services")} className="footer-link">Styling</Link>
                </div>
                
                <div className="footer-section">
                    <h3 className="footer-title">Hours</h3>
                    <p className="footer-text">Monday - Friday: 8am - 8pm</p>
                    <p className="footer-text">Saturday - Sunday: Closed</p>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="footer-divider"></div>
                <p className="footer-copyright">© 2025 The Barber Book. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;