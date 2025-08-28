import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/AdminDashboard.css';
import API_BASE_URL from '../config/api.js';

function AdminDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [rescheduleData, setRescheduleData] = useState({
        newDate: "",
        newTime: ""
    });
    
    // Available time slots (8am - 7pm, hourly only)
    const timeSlots = [
        "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
        "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
    ];
    
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        loadAppointments();
    }, [navigate]);

    const loadAppointments = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/Admin/appointments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Sort appointments: upcoming first, then completed/cancelled at bottom
                const sortedAppointments = data.sort((a, b) => {
                    // First, sort by status priority
                    const statusPriority = {
                        'Confirmed': 1,
                        'Cancelled': 2,
                        'Completed': 3
                    };
                    
                    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
                    if (statusDiff !== 0) return statusDiff;
                    
                    // If same status, sort by date (earliest first)
                    const dateA = new Date(a.appointmentDate);
                    const dateB = new Date(b.appointmentDate);
                    const dateDiff = dateA - dateB;
                    if (dateDiff !== 0) return dateDiff;
                    
                    // If same date, sort by time (earliest first)
                    return a.appointmentTime.localeCompare(b.appointmentTime);
                });
                
                setAppointments(sortedAppointments);
            } else if (response.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            } else {
                setError('Failed to load appointments');
            }
        } catch (err) {
            setError('Error loading appointments');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminName');
        navigate('/admin/login');
    };

    const handleCancelAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/Admin/appointments/${id}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadAppointments();
            } else {
                setError('Failed to cancel appointment');
            }
        } catch (err) {
            setError('Error canceling appointment');
            console.error('Error:', err);
        }
    };

    const handleRescheduleAppointment = async () => {
        if (!selectedAppointment || !rescheduleData.newDate || !rescheduleData.newTime) {
            return;
        }

        try {
            // Convert time format for API (e.g., "2:00 PM" to "14:00:00")
            const timeParts = rescheduleData.newTime.split(' ');
            const time = timeParts[0];
            const period = timeParts[1];
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours);
            
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes}:00`;

            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/Admin/appointments/${selectedAppointment.id}/reschedule`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newDate: rescheduleData.newDate,
                    newTime: timeString
                })
            });

            if (response.ok) {
                setShowRescheduleModal(false);
                setSelectedAppointment(null);
                setRescheduleData({ newDate: "", newTime: "" });
                loadAppointments();
            } else {
                const errorData = await response.text();
                setError(errorData || 'Failed to reschedule appointment');
            }
        } catch (err) {
            setError('Error rescheduling appointment');
            console.error('Error:', err);
        }
    };

    const handleCleanupCompleted = async () => {
        if (!window.confirm('Mark all past appointments as completed?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/Admin/cleanup-completed`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                loadAppointments(); // Refresh the list
            } else {
                setError('Failed to cleanup completed appointments');
            }
        } catch (err) {
            setError('Error cleaning up appointments');
            console.error('Error:', err);
        }
    };

    const handleClearPastAppointments = async () => {
        if (!window.confirm('Are you sure you want to permanently delete all past appointments? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/Admin/clear-past-appointments`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                loadAppointments(); // Refresh the list
            } else {
                setError('Failed to clear past appointments');
            }
        } catch (err) {
            setError('Error clearing past appointments');
            console.error('Error:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'green';
            case 'cancelled': return 'red';
            case 'completed': return 'blue';
            default: return 'gray';
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading">Loading appointments...</div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div className="admin-header-content">
                    <h1 className="admin-title">Barber Admin Dashboard</h1>
                    <div className="admin-user">
                        <span>Welcome, {localStorage.getItem('adminName')}</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </div>

            <div className="admin-content">
                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={() => setError("")} className="error-close">×</button>
                    </div>
                )}

                <div className="appointments-header">
                    <h2>Appointments ({appointments.length})</h2>
                    <div className="header-actions">
                        <button onClick={loadAppointments} className="refresh-btn">Refresh</button>
                        <button onClick={handleCleanupCompleted} className="cleanup-btn">Mark Yesterday Complete</button>
                        <button onClick={handleClearPastAppointments} className="clear-past-btn">Clear Past Appointments</button>
                    </div>
                </div>

                <div className="appointments-list">
                    {appointments.length === 0 ? (
                        <div className="no-appointments">
                            <p>No appointments found</p>
                        </div>
                    ) : (
                        <>
                            {/* Upcoming Appointments */}
                            {appointments.filter(a => a.status === 'Confirmed').length > 0 && (
                                <div className="appointments-section">
                                    <h3 className="section-header">Upcoming Appointments</h3>
                                    <div className="section-appointments">
                                        {appointments.filter(a => a.status === 'Confirmed').map(appointment => (
                                            <div key={appointment.id} className={`appointment-card ${appointment.status.toLowerCase()}`}>
                                                <div className="appointment-header">
                                                    <h3>{appointment.customerName}</h3>
                                                    <span 
                                                        className={`status-badge status-${getStatusColor(appointment.status)}`}
                                                    >
                                                        {appointment.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="appointment-details">
                                                    <p><strong>Service:</strong> {appointment.serviceName}</p>
                                                    <p><strong>Date:</strong> {formatDate(appointment.appointmentDate)}</p>
                                                    <p><strong>Time:</strong> {formatTime(appointment.appointmentTime)}</p>
                                                    <p><strong>Phone:</strong> {appointment.customerPhone}</p>
                                                    {appointment.customerEmail && (
                                                        <p><strong>Email:</strong> {appointment.customerEmail}</p>
                                                    )}
                                                    {appointment.notes && (
                                                        <p><strong>Notes:</strong> {appointment.notes}</p>
                                                    )}
                                                </div>

                                                <div className="appointment-actions">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedAppointment(appointment);
                                                            setShowRescheduleModal(true);
                                                        }}
                                                        className="reschedule-btn"
                                                    >
                                                        Reschedule
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancelAppointment(appointment.id)}
                                                        className="cancel-btn"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Past Appointments */}
                            {appointments.filter(a => a.status !== 'Confirmed').length > 0 && (
                                <div className="appointments-section">
                                    <h3 className="section-header">Past Appointments</h3>
                                    <div className="section-appointments">
                                        {appointments.filter(a => a.status !== 'Confirmed').map(appointment => (
                                            <div key={appointment.id} className={`appointment-card ${appointment.status.toLowerCase()}`}>
                                                <div className="appointment-header">
                                                    <h3>{appointment.customerName}</h3>
                                                    <span 
                                                        className={`status-badge status-${getStatusColor(appointment.status)}`}
                                                    >
                                                        {appointment.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="appointment-details">
                                                    <p><strong>Service:</strong> {appointment.serviceName}</p>
                                                    <p><strong>Date:</strong> {formatDate(appointment.appointmentDate)}</p>
                                                    <p><strong>Time:</strong> {formatTime(appointment.appointmentTime)}</p>
                                                    <p><strong>Phone:</strong> {appointment.customerPhone}</p>
                                                    {appointment.customerEmail && (
                                                        <p><strong>Email:</strong> {appointment.customerEmail}</p>
                                                    )}
                                                    {appointment.notes && (
                                                        <p><strong>Notes:</strong> {appointment.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Reschedule Appointment</h3>
                        <p>Customer: {selectedAppointment?.customerName}</p>
                        
                        <div className="form-group">
                            <label>New Date:</label>
                            <input
                                type="date"
                                value={rescheduleData.newDate}
                                onChange={(e) => setRescheduleData(prev => ({
                                    ...prev,
                                    newDate: e.target.value
                                }))}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>New Time:</label>
                            <select
                                value={rescheduleData.newTime}
                                onChange={(e) => setRescheduleData(prev => ({
                                    ...prev,
                                    newTime: e.target.value
                                }))}
                            >
                                <option value="">Select Time</option>
                                {timeSlots.map(slot => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="modal-actions">
                            <button onClick={handleRescheduleAppointment} className="confirm-btn">
                                Reschedule
                            </button>
                            <button 
                                onClick={() => {
                                    setShowRescheduleModal(false);
                                    setSelectedAppointment(null);
                                    setRescheduleData({ newDate: "", newTime: "" });
                                }}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard; 