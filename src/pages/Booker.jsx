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
    const [bookedSlots, setBookedSlots] = useState(new Set()); // In real app, this would come from backend
    
    // Service options
    const services = [
        { id: 1, name: "Classic Haircut", price: "$35", duration: "50 min" },
        { id: 2, name: "Haircut with Designs", price: "$40", duration: "60 min" },
        { id: 3, name: "Beard & Mustache Trim", price: "$10", duration: "10 min" },
        { id: 4, name: "Eyebrow Shaping", price: "$5", duration: "5 min" }
    ];
    
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
    
    const handleBookAppointment = () => {
        if (selectedService && selectedDate && selectedTime) {
            // In a real app, you would send this data to your backend
            const appointmentData = {
                service: selectedService,
                date: selectedDate,
                time: selectedTime
            };
            
            // Store in localStorage for demo purposes
            localStorage.setItem('appointmentData', JSON.stringify(appointmentData));
            
            // Mark this slot as booked
            const dateString = selectedDate.toDateString();
            setBookedSlots(prev => new Set([...prev, dateString]));
            
            // Navigate to confirmation page
            navigate('/confirmation');
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
                                        <div className="service-price">{service.price}</div>
                                        <div className="service-duration">{service.duration}</div>
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
                        >
                            Confirm Booking
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Booker;