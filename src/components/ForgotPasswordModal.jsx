import { useState } from 'react';
import { fetchWithTenant } from '../utils/apiHelper.js';
import '../css/ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose, tenantName }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetchWithTenant('/Auth/recover-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setMessage('If the email exists, a recovery link has been sent to your inbox.');
                setEmail('');
            } else {
                try {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to send recovery email');
                } catch (parseError) {
                    const errorText = await response.text();
                    setError(errorText || 'Failed to send recovery email');
                }
            }
        } catch (err) {
            console.error('Forgot password error:', err);
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
        setEmail('');
        setError('');
        setMessage('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="forgot-password-modal">
                <div className="modal-header">
                    <h2>Forgot Password?</h2>
                    <p className="tenant-info">For {tenantName}</p>
                    <button 
                        className="close-button" 
                        onClick={handleClose}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="Enter your email address"
                        />
                        <small className="help-text">
                            Enter the email address associated with your admin account.
                        </small>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="success-message">
                            {message}
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
                            disabled={loading || !email}
                        >
                            {loading ? 'Sending...' : 'Send Recovery Email'}
                        </button>
                    </div>
                </form>

                <div className="help-section">
                    <h4>Need Help?</h4>
                    <ul>
                        <li>Check your spam/junk folder</li>
                        <li>Make sure you're using the correct email address</li>
                        <li>Recovery links expire after 1 hour</li>
                        <li>Contact support if you continue to have issues</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
