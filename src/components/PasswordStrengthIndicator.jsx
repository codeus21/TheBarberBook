import { useState, useEffect } from 'react';
import '../css/PasswordStrengthIndicator.css';

const PasswordStrengthIndicator = ({ password, onStrengthChange }) => {
    const [strength, setStrength] = useState({
        level: 0,
        label: '',
        color: '#666666',
        errors: []
    });

    useEffect(() => {
        if (!password) {
            setStrength({
                level: 0,
                label: '',
                color: '#666666',
                errors: []
            });
            onStrengthChange && onStrengthChange(null);
            return;
        }

        // Calculate password strength
        const strengthData = calculatePasswordStrength(password);
        setStrength(strengthData);
        onStrengthChange && onStrengthChange(strengthData);
    }, [password, onStrengthChange]);

    const calculatePasswordStrength = (password) => {
        let score = 0;
        const errors = [];

        // Length checks
        if (password.length < 8) {
            errors.push('At least 8 characters required');
        } else {
            score += 1;
        }

        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;

        // Character variety checks
        if (/[a-z]/.test(password)) score += 1;
        else errors.push('Lowercase letter required');

        if (/[A-Z]/.test(password)) score += 1;
        else errors.push('Uppercase letter required');

        if (/[0-9]/.test(password)) score += 1;
        else errors.push('Number required');

        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else errors.push('Special character required');

        // Penalty for common patterns
        const commonPatterns = ['password', '123456', 'admin', 'qwerty', 'abc123'];
        if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
            score -= 2;
            errors.push('Avoid common words');
        }

        // Penalty for repeated characters
        if (/(.)\1{2,}/.test(password)) {
            score -= 1;
            errors.push('Avoid repeated characters');
        }

        // Determine strength level
        let level, label, color;
        if (score <= 2) {
            level = 1;
            label = 'Very Weak';
            color = '#ff4444';
        } else if (score <= 4) {
            level = 2;
            label = 'Weak';
            color = '#ff8800';
        } else if (score <= 6) {
            level = 3;
            label = 'Fair';
            color = '#ffbb00';
        } else if (score <= 8) {
            level = 4;
            label = 'Good';
            color = '#88cc00';
        } else {
            level = 5;
            label = 'Strong';
            color = '#00aa00';
        }

        return {
            level,
            label,
            color,
            errors: errors.filter((error, index) => errors.indexOf(error) === index)
        };
    };

    return (
        <div className="password-strength-indicator">
            <div className="strength-bar">
                <div 
                    className="strength-fill" 
                    style={{ 
                        width: `${(strength.level / 5) * 100}%`,
                        backgroundColor: strength.color
                    }}
                />
            </div>
            <div className="strength-info">
                <span 
                    className="strength-label" 
                    style={{ color: strength.color }}
                >
                    {strength.label}
                </span>
                {strength.errors.length > 0 && (
                    <div className="strength-errors">
                        {strength.errors.map((error, index) => (
                            <div key={index} className="error-item">
                                • {error}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PasswordStrengthIndicator;
