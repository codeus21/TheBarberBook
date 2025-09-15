import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTenantFromUrl } from '../utils/apiHelper.js';
import { getCurrentTheme, applyTheme } from '../utils/themeConfig.js';
import '../css/layout-confirmation.css';
import '../css/unified-theme.css';

function Confirmation(){
    const [appointmentData, setAppointmentData] = useState(null);
    const tenant = getTenantFromUrl();
    const theme = getCurrentTheme(tenant);

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

    // Apply theme CSS variables dynamically
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

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
            <div className={`confirmation-page ${tenant}-theme`}>
                <div className="confirmation-container">
                    <div className="confirmation-header">
                        <h1 className="confirmation-title">Loading...</h1>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className={`confirmation-page ${tenant}-theme`}>
            <div className="confirmation-container">
                <div className="confirmation-header">
                    <h1 className="confirmation-title">Booking Confirmed!</h1>
                    <p className="confirmation-subtitle">Your appointment has been successfully scheduled</p>
                </div>
                
                <div className="success-icon">✅</div>
                
                <div className="confirmation-details">
                    <h3 className="details-title">Appointment Details</h3>
                    <div className="detail-item">
                        <span className="detail-label">Customer Name:</span>
                        <span className="detail-value">{appointmentData.customerInfo?.firstName} {appointmentData.customerInfo?.lastName}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{appointmentData.customerInfo?.email}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{appointmentData.customerInfo?.phone}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Service:</span>
                        <span className="detail-value">{appointmentData.service.name} - ${appointmentData.service.price}</span>
                    </div>
                    {appointmentData.addOns && appointmentData.addOns.length > 0 && (
                        <div className="detail-item">
                            <span className="detail-label">Add-ons:</span>
                            <span className="detail-value">
                                {appointmentData.addOns.map(addon => addon.name).join(', ')} - +${appointmentData.addOns.reduce((sum, addon) => sum + parseFloat(addon.price), 0).toFixed(2)}
                            </span>
                        </div>
                    )}
                    <div className="detail-item">
                        <span className="detail-label">Total:</span>
                        <span className="detail-value">${appointmentData.totalPrice.toFixed(2)}</span>
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
                        <span className="detail-value">60 minutes</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Appointment ID:</span>
                        <span className="detail-value">#{appointmentData.appointmentId}</span>
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
                    <Link to={`/?tenant=${getTenantFromUrl()}`} className="done-button">Done</Link>
                </div>
            </div>
        </div>
    )
}

export default Confirmation;