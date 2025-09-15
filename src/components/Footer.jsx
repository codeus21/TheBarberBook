import { Link } from 'react-router-dom';
import { getTenantFromUrl } from '../utils/apiHelper.js';
import { getCurrentTheme, applyTheme } from '../utils/themeConfig.js';
import { useEffect } from 'react';
import '../css/layout-footer.css';
import '../css/unified-theme.css';

function Footer() {
    const tenant = getTenantFromUrl();
    const theme = getCurrentTheme(tenant);

    // Apply theme CSS variables dynamically
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);
    
    // Helper function to create links with tenant parameter
    const createLink = (path) => {
        return `${path}?tenant=${tenant}`;
    };

    return(
        <footer className={`footer ${tenant}-theme`}>
            <div className="footer-left">
                <Link to={createLink("/")} className="footer-brand">The Barber Book</Link>
                <p className="footer-tagline">Professional Grooming Services</p>
            </div>
            
            <div className="footer-center">
                <ul className="footer-links">
                    <li><Link to={createLink("/services")} className="footer-link">Services</Link></li>
                    <li><Link to={createLink("/reviews")} className="footer-link">Reviews</Link></li>
                    <li><Link to={createLink("/booker")} className="footer-link">Book Now</Link></li>
                </ul>
            </div>
            
            <div className="footer-right">
                <div className="footer-contact">
                    <p className="footer-phone">(123) 456-7890</p>
                    <p className="footer-hours">Mon-Fri: 9AM-6PM</p>
                </div>
            </div>
            
            <div className="footer-bottom">
                © 2025 The Barber Book. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer;