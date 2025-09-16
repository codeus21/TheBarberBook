import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTenantFromUrl, fetchWithTenant } from '../utils/apiHelper.js';
// Theme handled by CSS classes, not JavaScript
import '../css/layout-confirmation.css';
import '../css/unified-theme.css';

function Confirmation(){
    const [appointmentData, setAppointmentData] = useState(null);
    const [barberShop, setBarberShop] = useState(null);
    const tenant = getTenantFromUrl();

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

    // Load barber shop info for contact details
    useEffect(() => {
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

    // Debug theme application
    useEffect(() => {
        console.log('=== CONFIRMATION PAGE DEBUG ===');
        console.log('URL:', window.location.href);
        console.log('Tenant from URL:', tenant);
        console.log('Done button will navigate to:', `/?tenant=${tenant}`);
        
        // Debug: Check if CSS variables are set
        setTimeout(() => {
            const root = document.documentElement;
            console.log('CSS Variables:');
            console.log('--primary-color:', getComputedStyle(root).getPropertyValue('--primary-color'));
            console.log('--background-color:', getComputedStyle(root).getPropertyValue('--background-color'));
            console.log('--accent-bg:', getComputedStyle(root).getPropertyValue('--accent-bg'));
            console.log('--text-color:', getComputedStyle(root).getPropertyValue('--text-color'));
            console.log('=== END DEBUG ===');
        }, 100);
    }, [tenant]);

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
                        If you need to make any changes, please contact us at {barberShop?.businessPhone || '(123) 456-7890'} or email us at {barberShop?.adminEmail || 'contact@barbershop.com'}
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