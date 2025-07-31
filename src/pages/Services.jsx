import { Link } from "react-router-dom";
import '../css/Services.css';

function Services() {
    return(
        <div className="services-page">
            <div className="services-container">
                <div className="services-header">
                    <h1 className="services-title">Our Services</h1>
                    <p className="services-subtitle">Professional Grooming Services for the Modern Gentleman</p>
                </div>
                
                <div className="services-grid">
                    <div className="service-card">
                        <div className="service-icon">✂️</div>
                        <h3 className="service-title">Classic Haircut</h3>
                        <p className="service-description">
                            Professional haircut with consultation, cut, and style. 
                            Perfect for any occasion.
                        </p>
                        <div className="service-price">$35</div>
                        <Link to="/booker" className="book-service-btn">Book Now</Link>
                    </div>
                    
                    <div className="service-card">
                        <div className="service-icon">🎨</div>
                        <h3 className="service-title">Haircut with Designs</h3>
                        <p className="service-description">
                            Creative haircut with custom designs, fades, and artistic styling. 
                            Stand out from the crowd.
                        </p>
                        <div className="service-price">$40</div>
                        <Link to="/booker" className="book-service-btn">Book Now</Link>
                    </div>
                    
                    <div className="service-card">
                        <div className="service-icon">🧔</div>
                        <h3 className="service-title">Beard & Mustache Trim</h3>
                        <p className="service-description">
                            Professional beard and mustache trimming with shaping and styling. 
                            Only for real men.
                        </p>
                        <div className="service-price">$10</div>
                        <Link to="/booker" className="book-service-btn">Book Now</Link>
                    </div>
                    
                    <div className="service-card">
                        <div className="service-icon">👁️</div>
                        <h3 className="service-title">Eyebrow Shaping</h3>
                        <p className="service-description">
                            Precision eyebrow shaping and grooming for a polished, professional look.
                        </p>
                        <div className="service-price">$5</div>
                        <Link to="/booker" className="book-service-btn">Book Now</Link>
                    </div>
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