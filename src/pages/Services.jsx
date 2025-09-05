import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../css/Services.css';
import API_BASE_URL from '../config/api.js';

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load services from API
    useEffect(() => {
        const loadServices = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/Services`);
                if (response.ok) {
                    const data = await response.json();
                    setServices(data);
                } else {
                    setError('Failed to load services');
                }
            } catch (err) {
                setError('Error loading services');
                console.error('Error loading services:', err);
            } finally {
                setLoading(false);
            }
        };
        
        loadServices();
    }, []);

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
        <div className="services-page">
            <div className="services-container">
                <div className="services-header">
                    <h1 className="services-title">Our Services</h1>
                    <p className="services-subtitle">Professional Grooming Services for the Modern Gentleman</p>
                </div>
                
                <div className="services-grid">
                    {services.map(service => (
                        <div key={service.id} className="service-card">
                            <div className="service-icon">{getServiceIcon(service.name)}</div>
                            <h3 className="service-title">{service.name}</h3>
                            <p className="service-description">
                                {service.description || 'Professional grooming service with consultation and styling.'}
                            </p>
                            <div className="service-price">${service.price}</div>
                            <div className="service-duration">{service.durationMinutes} min</div>
                            <Link to="/booker" className="book-service-btn">Book Now</Link>
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