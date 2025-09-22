import { useState } from 'react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { fetchWithTenant } from '../utils/apiHelper.js';
import '../css/PasswordSetupModal.css';

const PasswordSetupModal = ({ isOpen, onClose, onSuccess, tenantName }) => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirm: false
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
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

        try {
            // Validate passwords match
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            const response = await fetchWithTenant('/Auth/setup-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onSuccess && onSuccess();
                onClose();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to set password');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Password setup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            password: '',
            confirmPassword: ''
        });
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="password-setup-modal">
                <div className="modal-header">
                    <h2>Set Up Your Password</h2>
                    <p className="tenant-info">Welcome to {tenantName}!</p>
                </div>

                <form onSubmit={handleSubmit} className="password-form">
                    <div className="setup-info">
                        <p>For security, please set up a strong password for your admin account.</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword.password ? 'text' : 'password'}
                                id="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                required
                                disabled={loading}
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility('password')}
                                disabled={loading}
                            >
                                {showPassword.password ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        <PasswordStrengthIndicator 
                            password={formData.password}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
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
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
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

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="setup-button"
                            disabled={loading || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword}
                        >
                            {loading ? 'Setting up...' : 'Set Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordSetupModal;
