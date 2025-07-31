import { Link } from "react-router-dom";
import '../css/BarberProfile.css'

function BarberProfile() {
    return (
        <div className="barber-profile">
            <div className="barber-container">
                <div className="barber-header">
                    <h1 className="barber-title">Clean Cuts</h1>
                    <p className="barber-subtitle">Professional Barber Services</p>
                </div>
                
                <div className="barber-image-section">
                    <div className="barber-image-placeholder"></div>
                    <p>Get a clean cut with me at Clean Cuts! Book now!</p>
                </div>
                
                <div className="barber-info">
                    <div className="info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">John Doe</span>
                    </div>
                    
                    <div className="info-item">
                        <span className="info-label">About Me:</span>
                        <span className="info-value">Self-taught friendly barber with 5 years experience.
                            Always open to new clients. Come give me a try!
                        </span>
                    </div>
                    
                    <div className="info-item">
                        <span className="info-label">Address:</span>
                        <span className="info-value">123 Main street</span>
                    </div>
                    
                    <div className="info-item">
                        <span className="info-label">Phone:</span>
                        <span className="info-value">123-456-7890</span>
                    </div>
                    
                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">example@cleancuts.com</span>
                    </div>
                </div>
                
                <div className="barber-hours">
                    <div className="hours-title">Business Hours</div>
                    <div className="hours-text">
                        Monday - Friday: 8am - 8pm<br/>
                        Saturday and Sunday: Closed
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