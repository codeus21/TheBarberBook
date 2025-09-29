import { useState, useEffect, useMemo } from 'react';
import { fetchWithTenant } from '../utils/apiHelper.js';

function AvailabilityManager({ isOpen, onClose, onSuccess }) {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDay, setEditingDay] = useState(null);
    const [selectedHours, setSelectedHours] = useState(new Set());
    const [bookedSlots, setBookedSlots] = useState(new Set());

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Get today and the next 2 weeks
    const getNextTwoWeeks = useMemo(() => {
        const today = new Date();
        const days = [];
        
        for (let i = 0; i < 14; i++) { // Start from today, go 14 days forward
            const day = new Date(today);
            day.setDate(today.getDate() + i);
            
            const dayIndex = day.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const dayName = daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1]; // Convert to Monday-Sunday
            
            days.push({
                date: day,
                dayName: dayName,
                dateString: day.toISOString().split('T')[0],
                isToday: i === 0,
                isPast: i < 0
            });
        }
        return days;
    }, []); // Empty dependency array means this only runs once

    // Generate all hours of the day (24 hours)
    const getAllHours = () => {
        const hours = [];
        for (let hour = 0; hour <= 23; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            const displayTime = hour === 0 ? '12:00 AM' : 
                              hour < 12 ? `${hour}:00 AM` : 
                              hour === 12 ? '12:00 PM' : 
                              `${hour - 12}:00 PM`;
            hours.push({ timeString, displayTime, hour });
        }
        return hours;
    };

    // Get booked hours for a specific day
    const getBookedHoursForDay = async (day) => {
        try {
            // Get hours that have actual appointments (booked)
            const response = await fetchWithTenant(`/Appointments/booked-slots/${day.dateString}`);
            if (response.ok) {
                const bookedSlots = await response.json();
                return new Set(bookedSlots);
            }
        } catch (err) {
            console.error('Error loading booked slots:', err);
        }
        return new Set();
    };

    // Check if a time is in the past for today
    const isTimeInPast = (hour, day) => {
        if (!day.isToday) return false;
        
        const now = new Date();
        const currentHour = now.getHours();
        return hour < currentHour;
    };

    useEffect(() => {
        if (isOpen) {
            loadSchedules();
        }
    }, [isOpen]);

    const loadSchedules = async () => {
        console.log('loadSchedules called');
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetchWithTenant('/Admin/availability', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Loaded schedules:', data);
                    setSchedules(data);
            } else {
                setError('Failed to load availability schedules');
            }
        } catch (err) {
            setError('Error loading availability schedules');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };


    const handleEditDay = async (day) => {
        setEditingDay(day);
        
        // Get existing schedules for this specific date
        const daySchedules = schedules.filter(s => {
            const scheduleDateOnly = s.scheduleDate.split('T')[0];
            return scheduleDateOnly === day.dateString;
        });
        const existingHours = new Set();
        
        daySchedules.forEach(schedule => {
            const startHour = parseInt(schedule.startTime.split(':')[0]);
            const endHour = parseInt(schedule.endTime.split(':')[0]);
            for (let hour = startHour; hour < endHour; hour++) {
                existingHours.add(`${hour.toString().padStart(2, '0')}:00`);
            }
        });
        
        // Load booked slots for this day
        const booked = await getBookedHoursForDay(day);
        setBookedSlots(booked);
        setSelectedHours(existingHours);
        setShowEditModal(true);
    };

    const handleSaveDaySchedule = async () => {
        console.log('handleSaveDaySchedule called');
        if (!editingDay) {
            console.log('No editingDay, returning');
            return;
        }

        try {
            console.log('Starting save process for day:', editingDay.dateString);
            const token = localStorage.getItem('adminToken');
            console.log('Token found:', !!token);
            
            // First, delete existing schedules for this specific date
            const existingSchedules = schedules.filter(s => {
                const scheduleDateOnly = s.scheduleDate.split('T')[0];
                return scheduleDateOnly === editingDay.dateString;
            });
            console.log('Existing schedules to delete:', existingSchedules.length);
            console.log('Editing day date string:', editingDay.dateString);
            console.log('Current schedules:', schedules.map(s => ({ id: s.id, date: s.scheduleDate })));
            for (const schedule of existingSchedules) {
                console.log('Deleting schedule with ID:', schedule.id);
                const deleteResponse = await fetchWithTenant(`/Availability/${schedule.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Delete response status:', deleteResponse.status);
            }

            // Create new schedules for selected hours
            const selectedHoursArray = Array.from(selectedHours).sort();
            console.log('Selected hours array:', selectedHoursArray);
            
            if (selectedHoursArray.length === 0) {
                console.log('No hours selected, skipping schedule creation');
                setShowEditModal(false);
                setEditingDay(null);
                setSelectedHours(new Set());
                loadSchedules();
                return;
            }
            
            let currentStart = null;
            let currentEnd = null;

            for (let i = 0; i < selectedHoursArray.length; i++) {
                const hour = selectedHoursArray[i];
                const nextHour = selectedHoursArray[i + 1];
                
                if (currentStart === null) {
                    currentStart = hour;
                }
                
                // If this is the last hour or there's a gap, end the current block
                if (!nextHour || parseInt(nextHour.split(':')[0]) !== parseInt(hour.split(':')[0]) + 1) {
                    currentEnd = `${(parseInt(hour.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;
                    
                    // Create schedule for this time block
                    console.log('Creating schedule:', {
                        ScheduleDate: editingDay.dateString,
                        StartTime: currentStart,
                        EndTime: currentEnd,
                        IsAvailable: true
                    });
                    
                    console.log('About to make API call to /Availability');
                    
                    // Test if we can reach the backend at all
                    try {
                        const testResponse = await fetchWithTenant('/Health');
                        console.log('Health check response:', testResponse.status);
                    } catch (testError) {
                        console.error('Health check failed:', testError);
                    }
                    
                    // Test if we can reach an admin endpoint
                    try {
                        const adminTestResponse = await fetchWithTenant('/Admin/availability', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        console.log('Admin availability test response:', adminTestResponse.status);
                    } catch (adminTestError) {
                        console.error('Admin availability test failed:', adminTestError);
                    }
                    
                    // Add timeout to prevent hanging
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                    
                    const createResponse = await fetchWithTenant('/Availability', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ScheduleDate: editingDay.dateString,
                            StartTime: currentStart,
                            EndTime: currentEnd,
                            IsAvailable: true
                        }),
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    console.log('Create response received, status:', createResponse.status);
                    console.log('Create response headers:', Object.fromEntries(createResponse.headers.entries()));
                    if (!createResponse.ok) {
                        const errorText = await createResponse.text();
                        console.error('Failed to create schedule:', errorText);
                        throw new Error(`Failed to create schedule: ${errorText}`);
                    }
                    
                    const responseData = await createResponse.json();
                    console.log('Schedule created successfully:', responseData);
                    
                    currentStart = null;
                    currentEnd = null;
                }
            }

            console.log('Save process completed successfully');
            setShowEditModal(false);
            setEditingDay(null);
            setSelectedHours(new Set());
            console.log('About to call loadSchedules()');
            loadSchedules();
        } catch (err) {
            console.error('Error in handleSaveDaySchedule:', err);
            if (err.name === 'AbortError') {
                setError('Request timed out. The server may be overloaded or there may be a network issue.');
            } else {
                setError('Error saving schedule: ' + err.message);
            }
        }
    };

    const handleClearAllSchedules = async () => {
        console.log('handleClearAllSchedules called');
        const confirmed = window.confirm(
            'Are you sure you want to delete ALL availability schedules?\n\n' +
            'This will remove all set hours for all days and make them unavailable for booking.\n\n' +
            'This action cannot be undone!'
        );

        if (!confirmed) return;

        try {
            const token = localStorage.getItem('adminToken');
            
            // Delete all existing schedules
            for (const schedule of schedules) {
                console.log('ClearAll: Deleting schedule with ID:', schedule.id);
                await fetchWithTenant(`/Availability/${schedule.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }

            // Reload schedules to reflect changes
            loadSchedules();
            
            // Show success message
            alert('All availability schedules have been cleared successfully!');
        } catch (err) {
            setError('Error clearing schedules');
            console.error('Error:', err);
        }
    };

    const handleUpdateSchedule = async (id, updatedData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetchWithTenant(`/Availability/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                loadSchedules();
            } else {
                const errorData = await response.text();
                setError(errorData || 'Failed to update schedule');
            }
        } catch (err) {
            setError('Error updating schedule');
            console.error('Error:', err);
        }
    };

    const handleDeleteSchedule = async (id) => {
        console.log('handleDeleteSchedule called with ID:', id);
        if (!window.confirm('Are you sure you want to delete this schedule?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetchWithTenant(`/Availability/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadSchedules();
            } else {
                setError('Failed to delete schedule');
            }
        } catch (err) {
            setError('Error deleting schedule');
            console.error('Error:', err);
        }
    };


    if (!isOpen) return null;

    return (
        <div className={isOpen === true ? "availability-manager-tab" : "modal-overlay"}>
            <div className={isOpen === true ? "availability-manager-content" : "modal availability-manager-modal"}>
                <div className="modal-header">
                    <h3>Manage Availability Schedule</h3>
                    {isOpen !== true && <button onClick={onClose} className="close-btn">×</button>}
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={() => setError('')} className="error-close">×</button>
                    </div>
                )}

                <>
                    <div className="availability-content">
                        {loading ? (
                            <div className="loading">Loading schedules...</div>
                        ) : (
                            <div className="availability-manager">
                                <div className="manager-header">
                                    <h4>Next 2 Weeks Schedule</h4>
                                    <div className="header-actions">
                                        <button onClick={handleClearAllSchedules} className="clear-all-btn">
                                            Clear All Schedules
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="week-grid">
                                    {getNextTwoWeeks.map((day, index) => {
                                        const daySchedules = schedules.filter(s => {
                                            // Convert schedule date to date-only string for comparison
                                            const scheduleDateOnly = s.scheduleDate.split('T')[0];
                                            return scheduleDateOnly === day.dateString;
                                        });
                                        const availableTimes = daySchedules.map(schedule => {
                                            const formatTime = (time24) => {
                                                const [hours, minutes] = time24.split(':');
                                                const hour = parseInt(hours);
                                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                                return `${displayHour}${ampm}`;
                                            };
                                            return formatTime(schedule.startTime); // Only show start time
                                        });
                                        
                                        return (
                                            <div key={`${day.dateString}-${index}`} className={`day-card ${day.isToday ? 'today' : ''}`}>
                                                <div className="day-header">
                                                    <h5>
                                                        {day.dayName}
                                                        {day.isToday && <span className="today-badge">Today</span>}
                                                    </h5>
                                                    <span className="day-date">
                                                        {day.date.getMonth() + 1}/{day.date.getDate()}
                                                    </span>
                                                </div>
                                                
                                                <div className="day-content">
                                                    {availableTimes.length === 0 ? (
                                                        <p className="no-availability">No hours set</p>
                                                    ) : (
                                                        <div className="available-times">
                                                            {availableTimes.map((time, timeIndex) => (
                                                                <span key={timeIndex} className="time-block">
                                                                    {time}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={() => handleEditDay(day)}
                                                        className="edit-day-btn"
                                                    >
                                                        ✏️ Edit Hours
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {isOpen !== true && (
                        <div className="modal-actions">
                            <button onClick={onClose} className="cancel-btn">Close</button>
                        </div>
                    )}
                </>
            </div>

            {/* Edit Day Modal */}
            {showEditModal && editingDay && (
                <div className="modal-overlay">
                    <div className="modal edit-day-modal">
                        <h3>Edit Hours for {editingDay.dayName} ({editingDay.date.getMonth() + 1}/{editingDay.date.getDate()})</h3>
                        
                        <div className="hours-grid">
                            {getAllHours().map(hour => {
                                const isBooked = bookedSlots.has(hour.timeString);
                                const isPast = isTimeInPast(hour.hour, editingDay);
                                const isSelected = selectedHours.has(hour.timeString);
                                const isDisabled = isBooked || isPast;
                                
                                return (
                                    <label 
                                        key={hour.timeString} 
                                        className={`hour-checkbox ${isBooked ? 'booked' : ''} ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            disabled={isDisabled}
                                            onChange={(e) => {
                                                if (isDisabled) return;
                                                const newSelectedHours = new Set(selectedHours);
                                                if (e.target.checked) {
                                                    newSelectedHours.add(hour.timeString);
                                                } else {
                                                    newSelectedHours.delete(hour.timeString);
                                                }
                                                setSelectedHours(newSelectedHours);
                                            }}
                                        />
                                        <span className="hour-label">
                                            {hour.displayTime}
                                            {isBooked && <span className="status-text"> (Booked)</span>}
                                            {isPast && <span className="status-text"> (Past)</span>}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                        
                        <div className="modal-actions">
                            <button onClick={() => {
                                console.log('Save button clicked!');
                                handleSaveDaySchedule();
                            }} className="confirm-btn">Save Hours</button>
                            <button onClick={() => {
                                setShowEditModal(false);
                                setEditingDay(null);
                                setSelectedHours(new Set());
                            }} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AvailabilityManager;
