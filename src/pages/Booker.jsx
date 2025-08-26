import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/Booker.css'

function Booker() {
    const navigate = useNavigate();
    
    // State management
    const [selectedHaircut, setSelectedHaircut] = useState(null);
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookedSlots, setBookedSlots] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Customer information state
    const [customerInfo, setCustomerInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    
    // API base URL - update this to match your deployed C# API URL
    const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://barbershopapi-production-a935.up.railway.app/api'
        : 'https://localhost:7074/api';
    
    // Service options - will be loaded from API
    const [services, setServices] = useState([]);
    
    // Available time slots (8am - 7pm, Monday - Friday, hourly only)
    const timeSlots = [
        "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
        "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
    ];
    
    // Calendar functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const days = [];
        
        // Add previous month's days
        for (let i = startingDay - 1; i >= 0; i--) {
            const prevDate = new Date(year, month, -i);
            days.push({ date: prevDate, isCurrentMonth: false });
        }
        
        // Add current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            days.push({ date: currentDate, isCurrentMonth: true });
        }
        
        // Add next month's days to complete the grid
        const remainingDays = 42 - days.length; // 6 rows * 7 days
        for (let i = 1; i <= remainingDays; i++) {
            const nextDate = new Date(year, month + 1, i);
            days.push({ date: nextDate, isCurrentMonth: false });
        }
        
        return days;
    };
    
    const isDateAvailable = (date) => {
        const day = date.getDay();
        const today = new Date();
        const twoWeeksFromNow = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
        
        // Only Monday-Friday (1-5), not in the past, and within 2 weeks
        return day >= 1 && day <= 5 && date >= today && date <= twoWeeksFromNow;
    };
    
    const isDateBooked = (date) => {
        const dateString = date.toDateString();
        return bookedSlots.has(dateString);
    };
    
    const handleDateClick = (date) => {
        if (isDateAvailable(date) && !isDateBooked(date)) {
            setSelectedDate(date);
            setSelectedTime(null); // Reset time when date changes
            loadBookedSlots(date); // Load booked slots for this date
        }
    };
    
    const handleTimeClick = (time) => {
        if (selectedDate) {
            setSelectedTime(time);
        }
    };
    
    const handleHaircutSelect = (service) => {
        setSelectedHaircut(service);
    };

    const handleAddOnToggle = (service) => {
        setSelectedAddOns(prev => {
            const isSelected = prev.find(addon => addon.id === service.id);
            if (isSelected) {
                return prev.filter(addon => addon.id !== service.id);
            } else {
                return [...prev, service];
            }
        });
    };

    // Handle customer information changes
    const handleCustomerInfoChange = (field, value) => {
        setCustomerInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Validate customer information
    const isCustomerInfoValid = () => {
        return customerInfo.firstName.trim() !== '' && 
               customerInfo.lastName.trim() !== '' && 
               customerInfo.email.trim() !== '' && 
               customerInfo.phone.trim() !== '';
    };
    
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
            }
        };
        
        loadServices();
    }, []);

    // Load booked slots for a specific date
    const loadBookedSlots = async (date) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Appointments/available-slots/${date.toISOString().split('T')[0]}`);
            if (response.ok) {
                const availableSlots = await response.json();
                
                // Convert API time format (HH:MM:SS) to display format (H:MM AM/PM)
                const availableDisplaySlots = availableSlots.map(apiTime => {
                    const [hours, minutes] = apiTime.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    return `${displayHour}:${minutes} ${ampm}`;
                });
                
                // Find booked slots (slots not in available list)
                const booked = timeSlots.filter(slot => !availableDisplaySlots.includes(slot));
                setBookedSlots(new Set(booked));
            }
        } catch (err) {
            console.error('Error loading booked slots:', err);
        }
    };

    const handleBookAppointment = async () => {
        if (selectedHaircut && selectedDate && selectedTime && isCustomerInfoValid()) {
            setLoading(true);
            setError(null);
            
            try {
                // Convert time format for API
                const timeParts = selectedTime.split(' ');
                const time = timeParts[0];
                const period = timeParts[1];
                let [hours, minutes] = time.split(':');
                hours = parseInt(hours);
                
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                
                const timeString = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
                
                // Create notes with selected services
                const selectedServices = [selectedHaircut, ...selectedAddOns];
                const serviceNames = selectedServices.map(s => s.name).join(", ");
                const totalPrice = selectedServices.reduce((sum, s) => sum + parseFloat(s.price), 0);
                
                const appointmentData = {
                    serviceId: selectedHaircut.id, // Use haircut as primary service
                    appointmentDate: selectedDate.toISOString().split('T')[0],
                    appointmentTime: timeString,
                    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                    customerPhone: customerInfo.phone,
                    customerEmail: customerInfo.email,
                    notes: `Services: ${serviceNames}. Total: $${totalPrice.toFixed(2)}`,
                    status: "Confirmed"
                };
                
                const response = await fetch(`${API_BASE_URL}/Appointments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(appointmentData)
                });
                
                if (response.ok) {
                    const createdAppointment = await response.json();
                    
                    // Store appointment data for confirmation page
                    localStorage.setItem('appointmentData', JSON.stringify({
                        service: selectedHaircut,
                        addOns: selectedAddOns,
                        date: selectedDate,
                        time: selectedTime,
                        appointmentId: createdAppointment.id,
                        totalPrice: totalPrice,
                        customerInfo: customerInfo
                    }));
                    
                    // Navigate to confirmation page
                    navigate('/confirmation');
                } else {
                    const errorData = await response.text();
                    setError(errorData || 'Failed to book appointment');
                }
            } catch (err) {
                setError('Error booking appointment');
                console.error('Error booking appointment:', err);
            } finally {
                setLoading(false);
            }
        }
    };
    
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    const formatTime = (time) => {
        return time;
    };
    
    const getMonthName = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };
    
    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            if (direction === 'next') {
                newMonth.setMonth(newMonth.getMonth() + 1);
            } else {
                newMonth.setMonth(newMonth.getMonth() - 1);
            }
            return newMonth;
        });
    };
    
    const days = getDaysInMonth(currentMonth);
    const isBookingComplete = selectedHaircut && selectedDate && selectedTime && isCustomerInfoValid();
    
    return (
        <div className="booking-page">
            <div className="booking-container">
                <div className="booking-header">
                    <h1 className="booking-title">Book Your Appointment</h1>
                    <p className="booking-subtitle">Select Your Service, Date, and Time</p>
                    {error && (
                        <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                            {error}
                        </div>
                    )}
                </div>
                
                <div className="booking-form">
                    {/* Service Selection Sidebar */}
                    <div className="booking-sidebar">
                        {/* Haircut Selection */}
                        <div className="sidebar-section">
                            <h3 className="section-title">Select Haircut (Required)</h3>
                            <div className="service-options">
                                {services.filter(service => service.name.includes('Haircut')).map(service => (
                                    <div 
                                        key={service.id}
                                        className={`service-option ${selectedHaircut?.id === service.id ? 'selected' : ''}`}
                                        onClick={() => handleHaircutSelect(service)}
                                    >
                                        <div className="service-name">{service.name}</div>
                                        <div className="service-price">${service.price}</div>
                                        <div className="service-duration">60 min</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add-ons Selection */}
                        <div className="sidebar-section">
                            <h3 className="section-title">Add-ons (Optional)</h3>
                            <div className="service-options">
                                {services.filter(service => !service.name.includes('Haircut')).map(service => (
                                    <div 
                                        key={service.id}
                                        className={`service-option ${selectedAddOns.find(addon => addon.id === service.id) ? 'selected' : ''}`}
                                        onClick={() => handleAddOnToggle(service)}
                                    >
                                        <div className="service-name">{service.name}</div>
                                        <div className="service-price">+${service.price}</div>
                                        <div className="service-duration"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Information Section */}
                        <div className="sidebar-section">
                            <h3 className="section-title">Your Information</h3>
                            <div className="customer-info-form">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name *</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={customerInfo.firstName}
                                        onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                                        placeholder="Enter your first name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name *</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={customerInfo.lastName}
                                        onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                                        placeholder="Enter your last name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={customerInfo.email}
                                        onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={customerInfo.phone}
                                        onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Calendar Section */}
                    <div className="calendar-section">
                        <div className="calendar-header">
                            <div className="calendar-nav">
                                <button className="nav-btn" onClick={() => navigateMonth('prev')}>
                                    ← Previous
                                </button>
                                <button className="nav-btn" onClick={() => navigateMonth('next')}>
                                    Next →
                                </button>
                            </div>
                            <div className="current-month">{getMonthName(currentMonth)}</div>
                        </div>
                        
                        {/* Calendar Grid */}
                        <div className="calendar-grid">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="calendar-day-header">{day}</div>
                            ))}
                            
                            {days.map((day, index) => {
                                const isAvailable = isDateAvailable(day.date);
                                const isBooked = isDateBooked(day.date);
                                const isSelected = selectedDate && selectedDate.toDateString() === day.date.toDateString();
                                
                                let className = 'calendar-day';
                                if (!day.isCurrentMonth) className += ' other-month';
                                else if (isBooked) className += ' booked';
                                else if (isSelected) className += ' selected';
                                else if (isAvailable) className += ' available';
                                
                                return (
                                    <div 
                                        key={index}
                                        className={className}
                                        onClick={() => handleDateClick(day.date)}
                                    >
                                        {day.date.getDate()}
                                    </div>
                                );
                            })}
                        </div>
                        
                                                 {/* Time Slots */}
                         {selectedDate && (
    <div>
                                 <h3 className="section-title">
                                     Available Times for {formatDate(selectedDate)}
                                 </h3>
                                 <div className="time-slots">
                                     {timeSlots.map(time => {
                                         // Convert time to API format for comparison
                                         const timeParts = time.split(' ');
                                         const timeOnly = timeParts[0];
                                         const period = timeParts[1];
                                         let [hours, minutes] = timeOnly.split(':');
                                         hours = parseInt(hours);
                                         
                                         if (period === 'PM' && hours !== 12) hours += 12;
                                         if (period === 'AM' && hours === 12) hours = 0;
                                         
                                         const timeString = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
                                         
                                         // Check if this time is booked
                                         const isBooked = bookedSlots.has(time);
                                         const isSelected = selectedTime === time;
                                         
                                         // Only show available time slots
                                         if (isBooked) {
                                             return null; // Don't render booked slots
                                         }
                                         
                                         let className = 'time-slot';
                                         if (isSelected) className += ' selected';
                                         
                                         return (
                                             <div 
                                                 key={time}
                                                 className={className}
                                                 onClick={() => handleTimeClick(time)}
                                             >
                                                 {time}
                                             </div>
                                         );
                                     }).filter(Boolean)} {/* Remove null entries */}
                                 </div>
                             </div>
                         )}
                    </div>
                </div>
                
                {/* Booking Summary */}
                {isBookingComplete && (
                    <div className="booking-summary">
                        <h3 className="summary-title">Booking Summary</h3>
                        <div className="summary-details">
                            <div className="customer-summary">
                                <h4>Customer Information</h4>
                                <p><strong>Name:</strong> {customerInfo.firstName} {customerInfo.lastName}</p>
                                <p><strong>Email:</strong> {customerInfo.email}</p>
                                <p><strong>Phone:</strong> {customerInfo.phone}</p>
                            </div>
                            <div className="service-summary">
                                <h4>Service Details</h4>
                                <p><strong>Haircut:</strong> {selectedHaircut.name} - ${selectedHaircut.price}</p>
                                {selectedAddOns.length > 0 && (
                                    <div>
                                        <p><strong>Add-ons:</strong></p>
                                        {selectedAddOns.map(addon => (
                                            <p key={addon.id} style={{ marginLeft: '20px' }}>
                                                • {addon.name} - +${addon.price}
                                            </p>
                                        ))}
                                    </div>
                                )}
                                <p><strong>Total:</strong> ${(selectedAddOns.reduce((sum, addon) => sum + parseFloat(addon.price), 0) + parseFloat(selectedHaircut.price)).toFixed(2)}</p>
                            </div>
                            <div className="appointment-summary">
                                <h4>Appointment Details</h4>
                                <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                                <p><strong>Time:</strong> {formatTime(selectedTime)}</p>
                                <p><strong>Duration:</strong> 60 minutes</p>
                            </div>
                        </div>
                        <button 
                            className="book-appointment-btn"
                            onClick={handleBookAppointment}
                            disabled={loading}
                        >
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                )}
        </div>
        </div>
    );
}

export default Booker;