import { useState } from 'react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { fetchWithTenant } from '../utils/apiHelper.js';
import '../css/PasswordChangeModal.css';

const PasswordChangeModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
        setSuccess('');
        
        // Clear error if spaces are removed from passwords
        if (error === 'Passwords cannot contain spaces' && !value.includes(' ')) {
            setError('');
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate passwords match
            if (formData.newPassword !== formData.confirmPassword) {
                setError('New passwords do not match');
                setLoading(false);
                return;
            }

            // Validate no spaces in passwords
            if (formData.currentPassword.includes(' ') || formData.newPassword.includes(' ')) {
                setError('Passwords cannot contain spaces');
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('adminToken');
            const response = await fetchWithTenant('/Auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess('Password changed successfully!');
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setTimeout(() => {
                    onSuccess && onSuccess();
                    onClose();
                }, 1500);
            } else {
                try {
                    const errorData = await response.json();
                    setError(errorData.message || errorData.title || 'Failed to change password');
                } catch (parseError) {
                    // If response is not JSON (plain text), get the text
                    const errorText = await response.text();
                    setError(errorText || 'Failed to change password');
                }
            }
        } catch (err) {
            console.error('Password change error:', err);
            // Check if it's a network error or a response parsing error
            if (err.message && err.message.includes('fetch')) {
                setError('Error connecting to server');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setError('');
        setSuccess('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="password-change-modal">
                <div className="modal-header">
                    <h2>Change Password</h2>
                    <button 
                        className="close-button" 
                        onClick={handleClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="password-form">
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword.current ? 'text' : 'password'}
                                id="currentPassword"
                                value={formData.currentPassword}
                                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility('current')}
                                disabled={loading}
                            >
                                {showPassword.current ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword.new ? 'text' : 'password'}
                                id="newPassword"
                                value={formData.newPassword}
                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility('new')}
                                disabled={loading}
                            >
                                {showPassword.new ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        <PasswordStrengthIndicator 
                            password={formData.newPassword}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword.confirm ? 'text' : 'password'}
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility('confirm')}
                                disabled={loading}
                            >
                                {showPassword.confirm ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                            <div className="password-mismatch">
                                Passwords do not match
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                        >
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
