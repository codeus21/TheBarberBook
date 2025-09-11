import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/Header.css'
import { getTenantFromUrl, fetchWithTenant } from '../utils/apiHelper.js';

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

    // Helper function to create links with tenant parameter
    const createLink = (path) => {
        return `${path}?tenant=${tenant}`;
    };

    return(
        <header className="header">
            <div className="header-container">
                <div>
                    <h1 className="header-title">
                        {barberShop?.name || 'Clean Cuts'}
                    </h1>
                    <p className="header-subtitle">Professional Grooming Services</p>
                </div>
                <nav className="header-nav">
                    <Link to={createLink("/")} className="nav-link">Home</Link>
                    <Link to={createLink("/services")} className='nav-link'>Services</Link>
                    <Link to={createLink("/reviews")} className="nav-link">Reviews</Link>
                    <Link to={createLink("/booker")} className="nav-link">Book Now</Link>
                </nav>
            </div>
        </header>
    )
}

export default Header;