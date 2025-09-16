import { Link } from 'react-router-dom';
import { getTenantFromUrl, fetchWithTenant } from '../utils/apiHelper.js';
import { getCurrentTheme, applyTheme } from '../utils/themeConfig.js';
import { useEffect, useState } from 'react';
import '../css/layout-footer.css';
import '../css/unified-theme.css';

function Footer() {
    const tenant = getTenantFromUrl();
    const theme = getCurrentTheme(tenant);
    const [barberShop, setBarberShop] = useState(null);

    // Apply theme CSS variables dynamically
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    // Load barber shop info for dynamic branding
    useEffect(() => {
        const loadBarberShop = async () => {
            try {
                const response = await fetchWithTenant('/BarberShop/current');
                if (response.ok) {
                    const data = await response.json();
                    setBarberShop(data);
                }
            } catch (err) {
                console.error('Error loading barber shop:', err);
            }
        };
        
        loadBarberShop();
    }, []);
    
    // Helper function to create links with tenant parameter
    const createLink = (path) => {
        return `${path}?tenant=${tenant}`;
    };

    return(
        <footer className={`footer ${tenant}-theme`}>
            <div className="footer-content">
                <div className="footer-left">
                    <Link to={createLink("/")} className="footer-brand">
                        {barberShop?.name || 'Cuts'}
                    </Link>
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
            </div>
            
            <div className="footer-bottom">
                © 2025 {barberShop?.name || 'Cuts'}. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer;