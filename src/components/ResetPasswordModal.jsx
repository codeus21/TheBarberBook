import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { fetchWithTenant } from '../utils/apiHelper.js';
import '../css/ResetPasswordModal.css';

const ResetPasswordModal = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false
    });

    const token = searchParams.get('token');
    const tenant = searchParams.get('tenant');

    useEffect(() => {
        console.log('Token:', token);
        console.log('Tenant:', tenant);
        console.log('Token length:', token?.length);
        if (!token || !tenant) {
            setError('Invalid reset link. Please request a new password reset.');
        }
    }, [token, tenant]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
        setSuccess('');
        
        // Clear error if spaces are removed from password
        if (error === 'Password cannot contain spaces' && !value.includes(' ')) {
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

        if (!token || !tenant) {
            setError('Invalid reset link');
            setLoading(false);
            return;
        }

        try {
            // Validate passwords match
            if (formData.newPassword !== formData.confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            // Validate no spaces in password
            if (formData.newPassword.includes(' ')) {
                setError('Password cannot contain spaces');
                setLoading(false);
                return;
            }

            const requestBody = {
                Token: token,
                NewPassword: formData.newPassword,
                ConfirmPassword: formData.confirmPassword
            };
            
            console.log('Request body:', requestBody);
            console.log('Token in request:', token);
            
            const response = await fetchWithTenant('/Auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                setSuccess('Password reset successfully! You can now log in with your new password.');
                setFormData({
                    newPassword: '',
                    confirmPassword: ''
                });
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate(`/admin/login?tenant=${tenant}`);
                }, 3000);
            } else {
                console.log('Response status:', response.status);
                console.log('Response URL:', response.url);
                try {
                    const errorData = await response.json();
                    console.log('Error data:', errorData);
                    setError(errorData.message || errorData.title || 'Failed to reset password');
                } catch (parseError) {
                    console.log('Parse error:', parseError);
                    const errorText = await response.text();
                    console.log('Error text:', errorText);
                    setError(errorText || `Failed to reset password (Status: ${response.status})`);
                }
            }
        } catch (err) {
            console.error('Reset password error:', err);
            if (err.message && err.message.includes('fetch')) {
                setError('Error connecting to server');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-modal">
                <div className="modal-header">
                    <h2>Reset Your Password</h2>
                    <p className="tenant-info">For {tenant?.replace('-', ' ')}</p>
                </div>

                <form onSubmit={handleSubmit} className="reset-password-form">
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
                                title={showPassword.new ? "Hide password" : "Show password"}
                            >
                                {showPassword.new ? "👁️" : "👁️‍🗨️"}
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
                                title={showPassword.confirm ? "Hide password" : "Show password"}
                            >
                                {showPassword.confirm ? "👁️" : "👁️‍🗨️"}
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
                            type="submit"
                            className="submit-button"
                            disabled={loading || !formData.newPassword || !formData.confirmPassword || !token}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </form>

                <div className="help-section">
                    <h4>Password Requirements:</h4>
                    <ul>
                        <li>At least 8 characters long</li>
                        <li>Contains uppercase and lowercase letters</li>
                        <li>Contains at least one number</li>
                        <li>Contains at least one special character</li>
                        <li>No spaces allowed</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordModal;
