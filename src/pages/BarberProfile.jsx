import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../css/BarberProfile.css';
import API_BASE_URL from '../config/api.js';

function BarberProfile() {
    const [barberShop, setBarberShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState({});

    // Load barber shop info from API
    useEffect(() => {
        const loadBarberShop = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/BarberShop/current`);
                if (response.ok) {
                    const data = await response.json();
                    setBarberShop(data);
                    
                    // Set theme from barber shop data
                    setTheme({
                        primaryColor: data.themeColor || '#D4AF37',
                        secondaryColor: data.secondaryColor || '#000000',
                        fontFamily: data.fontFamily || 'Arial, sans-serif',
                        logoUrl: data.logoUrl
                    });
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
        <div className="barber-profile" style={{ 
            '--primary-color': theme.primaryColor,
            '--secondary-color': theme.secondaryColor,
            '--font-family': theme.fontFamily
        }}>
            <div className="barber-container">
                <div className="barber-header">
                    {theme.logoUrl && (
                        <img src={theme.logoUrl} alt="Logo" className="barber-logo" />
                    )}
                    <h1 className="barber-title" style={{ color: theme.primaryColor }}>
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
                    <Link to="/booker" className="book-button">Book Now</Link>
                </div>
            </div>
        </div>
    )
}

export default BarberProfile;