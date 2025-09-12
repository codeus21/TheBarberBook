import React from 'react';
import { getTenantFromUrl } from '../utils/apiHelper.js';

const TenantSpecificLayout = ({ children }) => {
    const tenant = getTenantFromUrl();
    
    // Elite Cuts gets a completely different layout
    if (tenant === 'elite') {
        return (
            <div className="elite-layout">
                {/* Elite Cuts Header */}
                <div className="elite-hero-section">
                    <div className="elite-hero-content">
                        <h1 className="elite-gold">Elite Cuts</h1>
                        <p className="elite-subtitle">Where Excellence Meets Style</p>
                        <div className="elite-badge">Premium Barber Experience</div>
                    </div>
                    <div className="elite-hero-decoration">
                        <div className="elite-diamond"></div>
                        <div className="elite-diamond"></div>
                        <div className="elite-diamond"></div>
                    </div>
                </div>
                
                {/* Elite Cuts Content */}
                <div className="elite-content">
                    {children}
                </div>
                
                {/* Elite Cuts Footer */}
                <div className="elite-footer-section">
                    <div className="elite-premium">
                        <h3>Experience the Elite Difference</h3>
                        <p>Professional grooming services for the discerning gentleman</p>
                    </div>
                </div>
            </div>
        );
    }
    
    // Default Clean Cuts layout
    return (
        <div className="clean-layout">
            {children}
        </div>
    );
};

export default TenantSpecificLayout;
