import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/AdminLogin.css';
import API_BASE_URL from '../config/api.js';

function AdminLogin() {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin123");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/Auth/login`, {
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
                navigate('/admin/dashboard');
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

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <div className="admin-login-header">
                    <h1 className="admin-login-title">Barber Admin</h1>
                    <p className="admin-login-subtitle">Sign in to manage appointments</p>
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
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="admin123"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="admin-login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <p>Default credentials: admin / admin123</p>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin; 