import { useState, useEffect, useMemo } from 'react';
import { fetchWithTenant } from '../utils/apiHelper.js';

function AvailabilityManager({ isOpen, onClose }) {
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
        if (!editingDay) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            
            // First, delete existing schedules for this specific date
            const existingSchedules = schedules.filter(s => {
                const scheduleDateOnly = s.scheduleDate.split('T')[0];
                return scheduleDateOnly === editingDay.dateString;
            });
            for (const schedule of existingSchedules) {
                await fetchWithTenant(`/Availability/${schedule.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }

            // Create new schedules for selected hours
            const selectedHoursArray = Array.from(selectedHours).sort();
            
            if (selectedHoursArray.length === 0) {
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
                    const endHour = parseInt(hour.split(':')[0]) + 1;
                    // Handle the case where end hour would be 24 (which is invalid for TimeSpan)
                    if (endHour === 24) {
                        currentEnd = "23:59"; // Use 23:59 instead of 24:00
                    } else {
                        currentEnd = `${endHour.toString().padStart(2, '0')}:00`;
                    }
                    
                    // Create schedule for this time block
                    
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
                    
                    if (!createResponse.ok) {
                        const errorText = await createResponse.text();
                        throw new Error(`Failed to create schedule: ${errorText}`);
                    }
                    
                    currentStart = null;
                    currentEnd = null;
                }
            }

            setShowEditModal(false);
            setEditingDay(null);
            setSelectedHours(new Set());
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
                                        // Group consecutive schedules into ranges
                                        const availableTimes = [];
                                        if (daySchedules.length > 0) {
                                            // Sort schedules by start time
                                            const sortedSchedules = daySchedules.sort((a, b) => 
                                                a.startTime.localeCompare(b.startTime)
                                            );
                                            
                                            let currentStart = sortedSchedules[0].startTime;
                                            let currentEnd = sortedSchedules[0].endTime; // Track the end time of the last schedule
                                            
                                            for (let i = 1; i < sortedSchedules.length; i++) {
                                                const schedule = sortedSchedules[i];
                                                const prevSchedule = sortedSchedules[i-1];
                                                
                                                // Check if this schedule starts where the previous one ended
                                                if (schedule.startTime === prevSchedule.endTime) {
                                                    // Extend the current range - update the end time
                                                    currentEnd = schedule.endTime;
                                                } else {
                                                    // End current range and start a new one
                                                    availableTimes.push(formatTimeRange(currentStart, currentEnd));
                                                    currentStart = schedule.startTime;
                                                    currentEnd = schedule.endTime;
                                                }
                                            }
                                            // Add the last range - for single schedules, this will be the only range
                                            availableTimes.push(formatTimeRange(currentStart, currentEnd));
                                        }
                                        
                                        function formatTimeRange(startTime, endTime) {
                                            const formatTime = (time24) => {
                                                const [hours] = time24.split(':');
                                                const hour = parseInt(hours);
                                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                                return `${displayHour}${ampm}`;
                                            };
                                            
                                            const start = formatTime(startTime);
                                            
                                            // If it's a single hour slot (end time is start time + 1 hour), just show the start time
                                            const [startHours] = startTime.split(':');
                                            const [endHours] = endTime.split(':');
                                            const startHour = parseInt(startHours);
                                            const endHour = parseInt(endHours);
                                            
                                            if (endHour === startHour + 1) {
                                                return start;
                                            }
                                            
                                            // For ranges, we want to show the end time as the start time of the last slot
                                            // So we subtract 1 hour from the endTime to get the correct display
                                            const displayEndHour = endHour - 1; // Subtract 1 hour
                                            const finalEndHour = displayEndHour === 0 ? 12 : displayEndHour > 12 ? displayEndHour - 12 : displayEndHour;
                                            const endAmpm = displayEndHour >= 12 ? 'PM' : 'AM';
                                            const end = `${finalEndHour}${endAmpm}`;
                                            
                                            return `${start}-${end}`;
                                        }
                                        
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
                            <button onClick={handleSaveDaySchedule} className="confirm-btn">Save Hours</button>
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
