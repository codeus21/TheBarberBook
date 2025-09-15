import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../css/Services.css';
import '../css/UniversalThemes.css';
import { fetchWithTenant, getTenantFromUrl } from '../utils/apiHelper.js';

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [barberShop, setBarberShop] = useState(null);
    const tenant = getTenantFromUrl();

    // Load services and barber shop data from API
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load services
                const servicesResponse = await fetchWithTenant('/Services');
                if (servicesResponse.ok) {
                    const servicesData = await servicesResponse.json();
                    setServices(servicesData);
                }

                // Load barber shop theme data
                const barberResponse = await fetchWithTenant('/BarberShop/current');
                if (barberResponse.ok) {
                    const barberData = await barberResponse.json();
                    setBarberShop(barberData);
                }
            } catch (err) {
                setError('Error loading data: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, []);

    // Apply theme CSS variables
    useEffect(() => {
        if (barberShop) {
            const root = document.documentElement;
            root.style.setProperty('--primary-color', barberShop.themeColor);
            root.style.setProperty('--secondary-color', barberShop.secondaryColor);
            root.style.setProperty('--font-family', barberShop.fontFamily);
        }
    }, [barberShop]);

    // Get service icon based on service name
    const getServiceIcon = (serviceName) => {
        const name = serviceName.toLowerCase();
        if (name.includes('haircut') || name.includes('hair')) return '✂️';
        if (name.includes('beard') || name.includes('mustache')) return '🧔';
        if (name.includes('eyebrow') || name.includes('brow')) return '👁️';
        if (name.includes('design') || name.includes('style')) return '🎨';
        return '✂️'; // Default icon
    };

    if (loading) {
        return (
            <div className="services-page">
                <div className="services-container">
                    <div className="services-header">
                        <h1 className="services-title">Our Services</h1>
                        <p className="services-subtitle">Loading services...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="services-page">
                <div className="services-container">
                    <div className="services-header">
                        <h1 className="services-title">Our Services</h1>
                        <p className="services-subtitle" style={{ color: 'red' }}>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className={`services-page ${tenant}-layout`}>
            <div className="services-container">
                <div className={`services-header ${tenant === 'elite' ? 'elite-hero-section' : ''}`}>
                    <h1 className={`services-title ${tenant === 'elite' ? 'elite-gold' : ''}`}>
                        {barberShop?.name || 'Our Services'}
                    </h1>
                    <p className="services-subtitle">
                        {tenant === 'elite' ? 'Premium Grooming Services for the Discerning Gentleman' : 'Professional Grooming Services for the Modern Gentleman'}
                    </p>
                    {tenant === 'elite' && (
                        <div className="theme-badge">Exclusive Elite Experience</div>
                    )}
                </div>
                
                <div className="services-grid">
                    {services.map(service => (
                        <div key={service.id} className={`service-card ${tenant === 'elite' ? 'elite-service-card' : ''}`}>
                            <div className="service-icon">{getServiceIcon(service.name)}</div>
                            <h3 className="service-title">{service.name}</h3>
                            <p className="service-description">
                                {service.description || 'Professional grooming service with consultation and styling.'}
                            </p>
                            <div className="service-price">${service.price}</div>
                            <div className="service-duration">{service.durationMinutes} min</div>
                            <Link to={`/booker?tenant=${getTenantFromUrl()}`} className={`book-service-btn ${tenant === 'elite' ? 'elite-button' : ''}`}>
                                {tenant === 'elite' ? 'Reserve Now' : 'Book Now'}
                            </Link>
                        </div>
                    ))}
                </div>
                
                <div className="services-info">
                    <h3 className="info-title">Service Information</h3>
                    <p className="info-text">
                        All services include consultation and styling advice. 
                        We use premium products and maintain the highest standards of hygiene. 
                        Walk-ins welcome, but appointments are recommended for guaranteed service.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Services;