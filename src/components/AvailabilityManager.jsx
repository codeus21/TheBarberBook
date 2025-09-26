import { useState, useEffect } from 'react';
import { fetchWithTenant } from '../utils/apiHelper.js';

function AvailabilityManager({ isOpen, onClose, onSuccess }) {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        isAvailable: true
    });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

    const initializeDefaultSchedule = async () => {
        if (!window.confirm('Initialize default availability schedule (9 AM - 6 PM weekdays, 9 AM - 4 PM weekends)?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetchWithTenant('/Admin/availability/initialize-default', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                loadSchedules();
            } else {
                setError('Failed to initialize default schedule');
            }
        } catch (err) {
            setError('Error initializing default schedule');
            console.error('Error:', err);
        }
    };

    const handleAddSchedule = async () => {
        if (!newSchedule.dayOfWeek || !newSchedule.startTime || !newSchedule.endTime) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetchWithTenant('/api/Availability', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSchedule)
            });

            if (response.ok) {
                setShowAddModal(false);
                setNewSchedule({ dayOfWeek: '', startTime: '', endTime: '', isAvailable: true });
                loadSchedules();
            } else {
                const errorData = await response.text();
                setError(errorData || 'Failed to add schedule');
            }
        } catch (err) {
            setError('Error adding schedule');
            console.error('Error:', err);
        }
    };

    const handleUpdateSchedule = async (id, updatedData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetchWithTenant(`/api/Availability/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                setEditingSchedule(null);
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
            const response = await fetchWithTenant(`/api/Availability/${id}`, {
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

    const getSchedulesForDay = (day) => {
        return schedules.filter(s => s.dayOfWeek === day);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal availability-manager-modal">
                <div className="modal-header">
                    <h3>Manage Availability Schedule</h3>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={() => setError('')} className="error-close">×</button>
                    </div>
                )}

                <div className="availability-content">
                    {loading ? (
                        <div className="loading">Loading schedules...</div>
                    ) : schedules.length === 0 ? (
                        <div className="no-availability">
                            <p>No availability schedule set up yet.</p>
                            <button onClick={initializeDefaultSchedule} className="init-default-btn">
                                Initialize Default Schedule
                            </button>
                        </div>
                    ) : (
                        <div className="availability-manager">
                            <div className="manager-header">
                                <h4>Current Schedule</h4>
                                <div className="header-actions">
                                    <button onClick={() => setShowAddModal(true)} className="add-schedule-btn">
                                        Add Schedule
                                    </button>
                                    <button onClick={initializeDefaultSchedule} className="init-default-btn">
                                        Reset to Default
                                    </button>
                                </div>
                            </div>
                            
                            <div className="schedule-grid">
                                {daysOfWeek.map(day => {
                                    const daySchedules = getSchedulesForDay(day);
                                    return (
                                        <div key={day} className="day-schedule">
                                            <h5>{day}</h5>
                                            {daySchedules.length === 0 ? (
                                                <p className="unavailable">Not Available</p>
                                            ) : (
                                                daySchedules.map(schedule => (
                                                    <div key={schedule.id} className="time-slot">
                                                        <div className="time-info">
                                                            <span>{schedule.startTime} - {schedule.endTime}</span>
                                                            <span className={`status ${schedule.isAvailable ? 'available' : 'unavailable'}`}>
                                                                {schedule.isAvailable ? 'Available' : 'Unavailable'}
                                                            </span>
                                                        </div>
                                                        <div className="time-actions">
                                                            <button 
                                                                onClick={() => setEditingSchedule(schedule)}
                                                                className="edit-btn"
                                                                title="Edit"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteSchedule(schedule.id)}
                                                                className="delete-btn"
                                                                title="Delete"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-btn">Close</button>
                </div>
            </div>

            {/* Add Schedule Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal add-schedule-modal">
                        <h3>Add New Schedule</h3>
                        
                        <div className="form-group">
                            <label>Day of Week:</label>
                            <select
                                value={newSchedule.dayOfWeek}
                                onChange={(e) => setNewSchedule(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                            >
                                <option value="">Select Day</option>
                                {daysOfWeek.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Start Time:</label>
                            <input
                                type="time"
                                value={newSchedule.startTime}
                                onChange={(e) => setNewSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>End Time:</label>
                            <input
                                type="time"
                                value={newSchedule.endTime}
                                onChange={(e) => setNewSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={newSchedule.isAvailable}
                                    onChange={(e) => setNewSchedule(prev => ({ ...prev, isAvailable: e.target.checked }))}
                                />
                                Available
                            </label>
                        </div>
                        
                        <div className="modal-actions">
                            <button onClick={handleAddSchedule} className="confirm-btn">Add Schedule</button>
                            <button onClick={() => setShowAddModal(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Schedule Modal */}
            {editingSchedule && (
                <div className="modal-overlay">
                    <div className="modal edit-schedule-modal">
                        <h3>Edit Schedule</h3>
                        
                        <div className="form-group">
                            <label>Day: {editingSchedule.dayOfWeek}</label>
                        </div>
                        
                        <div className="form-group">
                            <label>Start Time:</label>
                            <input
                                type="time"
                                value={editingSchedule.startTime}
                                onChange={(e) => setEditingSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>End Time:</label>
                            <input
                                type="time"
                                value={editingSchedule.endTime}
                                onChange={(e) => setEditingSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={editingSchedule.isAvailable}
                                    onChange={(e) => setEditingSchedule(prev => ({ ...prev, isAvailable: e.target.checked }))}
                                />
                                Available
                            </label>
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                onClick={() => handleUpdateSchedule(editingSchedule.id, {
                                    startTime: editingSchedule.startTime,
                                    endTime: editingSchedule.endTime,
                                    isAvailable: editingSchedule.isAvailable
                                })} 
                                className="confirm-btn"
                            >
                                Update Schedule
                            </button>
                            <button onClick={() => setEditingSchedule(null)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AvailabilityManager;
