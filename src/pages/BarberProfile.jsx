import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchWithTenant, getTenantFromUrl } from '../utils/apiHelper.js';
// Theme handled by CSS classes in App.jsx
import '../css/layout-profile.css';
import '../css/unified-theme.css';

function BarberProfile() {
    const [barberShop, setBarberShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load barber shop info from API
    useEffect(() => {
        const loadBarberShop = async () => {
            try {
                const response = await fetchWithTenant('/BarberShop/current');
                if (response.ok) {
                    const data = await response.json();
                    setBarberShop(data);
                } else {
                    setError('Failed to load barber shop information');
                }
            } catch (err) {
                setError('Error loading barber shop information');
                console.error('Error loading barber shop:', err);
            } finally {
                setLoading(false);
            }
        };
        
        loadBarberShop();
    }, []);

    // Theme handled by CSS classes in App.jsx

    if (loading) {
        return (
            <div className="barber-profile">
                <div className="barber-container">
                    <div className="barber-header">
                        <h1 className="barber-title">Loading...</h1>
                        <p className="barber-subtitle">Loading barber shop information...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="barber-profile">
                <div className="barber-container">
                    <div className="barber-header">
                        <h1 className="barber-title">Error</h1>
                        <p className="barber-subtitle" style={{ color: 'red' }}>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="barber-profile">
            <div className="barber-container">
                <div className="barber-header">
                    {barberShop?.logoUrl && (
                        <img src={barberShop.logoUrl} alt="Logo" className="barber-logo" />
                    )}
                    <h1 className="barber-title">
                        {barberShop?.name || 'Barber Shop'}
                    </h1>
                    <p className="barber-subtitle">Professional Barber Services</p>
                </div>
                
                <div className="barber-image-section">
                    <div className="barber-image-placeholder"></div>
                    <p>Get a professional cut at {barberShop?.name || 'our barber shop'}! Book now!</p>
                </div>
                
                <div className="barber-info">
                    <div className="info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{barberShop?.name || 'Barber Shop'}</span>
                    </div>
                    
                    <div className="info-item">
                        <span className="info-label">About Us:</span>
                        <span className="info-value">
                            Professional barber services with years of experience.
                            We provide quality cuts and excellent customer service.
                        </span>
                    </div>
                    
                    {barberShop?.businessAddress && (
                        <div className="info-item">
                            <span className="info-label">Address:</span>
                            <span className="info-value">{barberShop.businessAddress}</span>
                        </div>
                    )}
                    
                    {barberShop?.businessPhone && (
                        <div className="info-item">
                            <span className="info-label">Phone:</span>
                            <span className="info-value">{barberShop.businessPhone}</span>
                        </div>
                    )}
                    
                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{barberShop?.adminEmail || 'contact@barbershop.com'}</span>
                    </div>
                </div>
                
                <div className="barber-hours">
                    <div className="hours-title">Business Hours</div>
                    <div className="hours-text">
                        {barberShop?.businessHours || 'Monday - Friday: 8am - 8pm\nSaturday and Sunday: Closed'}
                    </div>
                </div>
                
                <div className="book-button-container">
                    <Link to={`/booker?tenant=${getTenantFromUrl()}`} className="book-button">Book Now</Link>
                </div>
            </div>
        </div>
    )
}

export default BarberProfile;