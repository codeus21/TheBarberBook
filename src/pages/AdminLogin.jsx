import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/AdminLogin.css';
import { fetchWithTenant, getTenantFromUrl } from '../utils/apiHelper.js';
import PasswordSetupModal from '../components/PasswordSetupModal.jsx';
import ForgotPasswordModal from '../components/ForgotPasswordModal.jsx';

function AdminLogin() {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin123");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [authStatus, setAuthStatus] = useState(null);
    const [showPasswordSetup, setShowPasswordSetup] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [tenantName, setTenantName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetchWithTenant('/Auth/auth-status');
            if (response.ok) {
                const status = await response.json();
                setAuthStatus(status);
                setTenantName(status.tenantName);
                
                // Pre-fill credentials for default tenant
                if (status.isDefaultTenant) {
                    setUsername("admin");
                    setPassword("admin123");
                } else {
                    setUsername("admin");
                    setPassword("");
                }
            }
        } catch (err) {
            console.error('Error checking auth status:', err);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetchWithTenant('/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminName', data.name);
                
                // Check if password setup is required
                if (data.requiresPasswordSetup) {
                    setShowPasswordSetup(true);
                    return;
                }
                
                // Preserve tenant parameter in redirect
                const tenant = getTenantFromUrl();
                navigate(`/admin/dashboard?tenant=${tenant}`);
            } else {
                const errorData = await response.text();
                setError(errorData || 'Login failed');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSetupSuccess = () => {
        // After password setup, redirect to dashboard
        const tenant = getTenantFromUrl();
        navigate(`/admin/dashboard?tenant=${tenant}`);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <div className="admin-login-header">
                    <h1 className="admin-login-title">Barber Admin</h1>
                    <p className="admin-login-subtitle">Sign in to manage appointments</p>
                    {authStatus && (
                        <div className="tenant-info">
                            <p className="tenant-name">{authStatus.tenantName}</p>
                            {authStatus.isDefaultTenant && (
                                <p className="default-tenant-note">Using default credentials</p>
                            )}
                        </div>
                    )}
                </div>

                <form className="admin-login-form" onSubmit={handleLogin}>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                                disabled={loading}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="admin-login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    {/* Forgot Password Button - Only show for non-default tenants */}
                    {!authStatus?.isDefaultTenant && (
                        <div className="forgot-password-section">
                            <button
                                type="button"
                                className="forgot-password-btn"
                                onClick={() => setShowForgotPassword(true)}
                                disabled={loading}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}
                </form>

                <div className="admin-login-footer">
                    {authStatus?.isDefaultTenant ? (
                        <p>Default credentials: admin / admin123</p>
                    ) : (
                        <p>Enter your admin credentials</p>
                    )}
                </div>
            </div>

            {/* Password Setup Modal */}
            <PasswordSetupModal
                isOpen={showPasswordSetup}
                onClose={() => setShowPasswordSetup(false)}
                onSuccess={handlePasswordSetupSuccess}
                tenantName={tenantName}
            />

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
                tenantName={tenantName}
            />
        </div>
    );
}

export default AdminLogin; 