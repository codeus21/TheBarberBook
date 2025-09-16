import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTenantFromUrl, fetchWithTenant } from '../utils/apiHelper.js';
// Theme imports removed - handled by individual pages
import '../css/layout-header.css';
import '../css/unified-theme.css';

function Header(){
    const [tenant, setTenant] = useState('default');
    const [barberShop, setBarberShop] = useState(null);

    // Get tenant from URL and load barber shop info
    useEffect(() => {
        const currentTenant = getTenantFromUrl();
        setTenant(currentTenant);
        
        // Load barber shop info for dynamic title
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

    // Theme is applied by individual pages, not by Header

    // Helper function to create links with tenant parameter
    const createLink = (path) => {
        return `${path}?tenant=${tenant}`;
    };

    return(
        <header className="header">
            <div className="header-left">
                <Link to={createLink("/")} className="header-logo">
                    {barberShop?.name || 'Cuts'}
                </Link>
            </div>
            
            <nav className="header-nav">
                <Link to={createLink("/")} className="nav-link">Home</Link>
                <Link to={createLink("/services")} className="nav-link">Services</Link>
                <Link to={createLink("/reviews")} className="nav-link">Reviews</Link>
                <Link to={createLink("/booker")} className="nav-link">Book Now</Link>
            </nav>
            
            <div className="header-right">
                <div className="header-info">
                    <div className="business-name">{barberShop?.name || 'Cuts'}</div>
                    <div className="business-phone">{barberShop?.businessPhone || '(123) 456-7890'}</div>
                </div>
            </div>
        </header>
    )
}

export default Header;