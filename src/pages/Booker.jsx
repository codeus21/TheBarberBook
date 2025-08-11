import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/Booker.css'

function Booker() {
    const navigate = useNavigate();
    
    // State management
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookedSlots, setBookedSlots] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // API base URL - update this to match your C# API URL
    const API_BASE_URL = 'https://localhost:7074/api';
    
    // Service options - will be loaded from API
    const [services, setServices] = useState([]);
    
    // Available time slots (8am - 8pm, Monday - Friday)
    const timeSlots = [
        "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
        "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
        "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
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
    
    const handleServiceSelect = (service) => {
        setSelectedService(service);
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
                // Convert available slots to booked slots format
                const allSlots = timeSlots;
                const booked = allSlots.filter(slot => !availableSlots.includes(slot));
                setBookedSlots(new Set(booked));
            }
        } catch (err) {
            console.error('Error loading booked slots:', err);
        }
    };

    const handleBookAppointment = async () => {
        if (selectedService && selectedDate && selectedTime) {
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
                
                const appointmentData = {
                    serviceId: selectedService.id,
                    appointmentDate: selectedDate.toISOString().split('T')[0],
                    appointmentTime: timeString,
                    customerName: "John Doe", // In real app, get from form
                    customerPhone: "123-456-7890", // In real app, get from form
                    customerEmail: "john@example.com", // In real app, get from form
                    notes: "Online booking",
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
                        service: selectedService,
                        date: selectedDate,
                        time: selectedTime,
                        appointmentId: createdAppointment.id
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
    const isBookingComplete = selectedService && selectedDate && selectedTime;
    
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
                        <div className="sidebar-section">
                            <h3 className="section-title">Select Service</h3>
                            <div className="service-options">
                                {services.map(service => (
                                    <div 
                                        key={service.id}
                                        className={`service-option ${selectedService?.id === service.id ? 'selected' : ''}`}
                                        onClick={() => handleServiceSelect(service)}
                                    >
                                        <div className="service-name">{service.name}</div>
                                        <div className="service-price">${service.price}</div>
                                        <div className="service-duration">{service.durationMinutes} min</div>
                                    </div>
                                ))}
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
                                        const isBooked = false; // In real app, check against booked times
                                        const isSelected = selectedTime === time;
                                        
                                        let className = 'time-slot';
                                        if (isBooked) className += ' booked';
                                        else if (isSelected) className += ' selected';
                                        
                                        return (
                                            <div 
                                                key={time}
                                                className={className}
                                                onClick={() => handleTimeClick(time)}
                                            >
                                                {time}
                                            </div>
                                        );
                                    })}
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
                            <p><strong>Service:</strong> {selectedService.name} - {selectedService.price}</p>
                            <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                            <p><strong>Time:</strong> {formatTime(selectedTime)}</p>
                            <p><strong>Duration:</strong> {selectedService.duration}</p>
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