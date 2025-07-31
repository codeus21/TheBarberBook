import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../css/Confirmation.css';

function Confirmation(){
    const [appointmentData, setAppointmentData] = useState(null);

    useEffect(() => {
        // Retrieve appointment data from localStorage
        const storedData = localStorage.getItem('appointmentData');
        if (storedData) {
            const data = JSON.parse(storedData);
            // Convert date string back to Date object
            data.date = new Date(data.date);
            setAppointmentData(data);
        }
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    if (!appointmentData) {
        return (
            <div className="confirmation-page">
                <div className="confirmation-container">
                    <div className="confirmation-header">
                        <h1 className="confirmation-title">Loading...</h1>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="confirmation-page">
            <div className="confirmation-container">
                <div className="confirmation-header">
                    <h1 className="confirmation-title">Booking Confirmed!</h1>
                    <p className="confirmation-subtitle">Your appointment has been successfully scheduled</p>
                </div>
                
                <div className="success-icon">✅</div>
                
                <div className="confirmation-details">
                    <h3 className="details-title">Appointment Details</h3>
                    <div className="detail-item">
                        <span className="detail-label">Barber:</span>
                        <span className="detail-value">Clean Cuts</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Service:</span>
                        <span className="detail-value">{appointmentData.service.name} - {appointmentData.service.price}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{formatDate(appointmentData.date)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Time:</span>
                        <span className="detail-value">{appointmentData.time}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{appointmentData.service.duration}</span>
                    </div>
                </div>
                
                <div className="confirmation-message">
                    <h3 className="message-title">What's Next?</h3>
                    <p className="message-text">
                        Your appointment has been confirmed and added to our schedule. 
                        Please arrive 5 minutes before your scheduled time.
                    </p>
                    <p className="contact-info">
                        If you need to make any changes, please contact us at 123-456-7890 
                        or email us at example@cleancuts.com
                    </p>
                </div>
                
                <div className="done-button-container">
                    <Link to="/" className="done-button">Done</Link>
                </div>
            </div>
        </div>
    )
}

export default Confirmation;