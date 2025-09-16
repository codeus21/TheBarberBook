import { Link } from "react-router-dom";
import { getTenantFromUrl } from '../utils/apiHelper.js';
// Theme handled by CSS classes in App.jsx
import '../css/layout-reviews.css';
import '../css/unified-theme.css';

function Reviews() {
    // Theme handled by CSS classes in App.jsx
    
    return (
        <div className="reviews-page">
            <div className="reviews-container">
                <div className="reviews-header">
                    <h1 className="reviews-title">Customer Reviews</h1>
                    <p className="reviews-subtitle">What Our Clients Say About Our Services</p>
                </div>
                
                <div className="welcome-message">
                    We strive to have happy returning customers.
                </div>
                
                <div className="reviews-grid">
                    <div className="review-card">
                        <div className="review-header">
                            <div className="reviewer-avatar">👨</div>
                            <div className="reviewer-info">
                                <div className="reviewer-name">John Smith</div>
                                <div className="review-date">December 15, 2024</div>
                            </div>
                        </div>
                        <div className="star-rating">
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                        </div>
                        <p className="review-text">
                            "Amazing service! The barber was professional and gave me exactly what I wanted. 
                            Clean cuts and great attention to detail. Highly recommend!"
                        </p>
                        <div className="review-footer">
                            <span className="review-service">Classic Haircut</span>
                        </div>
                    </div>
                    
                    <div className="review-card">
                        <div className="review-header">
                            <div className="reviewer-avatar">👨‍🦱</div>
                            <div className="reviewer-info">
                                <div className="reviewer-name">Mike Johnson</div>
                                <div className="review-date">December 12, 2024</div>
                            </div>
                        </div>
                        <div className="star-rating">
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                        </div>
                        <p className="review-text">
                            "Got a haircut with designs and it turned out incredible! The artist was skilled 
                            and creative. Will definitely come back for more unique styles."
                        </p>
                        <div className="review-footer">
                            <span className="review-service">Haircut with Designs</span>
                        </div>
                    </div>
                    
                    <div className="review-card">
                        <div className="review-header">
                            <div className="reviewer-avatar">🧔</div>
                            <div className="reviewer-info">
                                <div className="reviewer-name">David Wilson</div>
                                <div className="review-date">December 10, 2024</div>
                            </div>
                        </div>
                        <div className="star-rating">
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                        </div>
                        <p className="review-text">
                            "Best beard trim I've ever had! The barber really knows how to shape facial hair. 
                            My beard has never looked better. Great service and atmosphere."
                        </p>
                        <div className="review-footer">
                            <span className="review-service">Beard & Mustache Trim</span>
                        </div>
                    </div>
                    
                    <div className="review-card">
                        <div className="review-header">
                            <div className="reviewer-avatar">👨‍💼</div>
                            <div className="reviewer-info">
                                <div className="reviewer-name">Robert Davis</div>
                                <div className="review-date">December 8, 2024</div>
                            </div>
                        </div>
                        <div className="star-rating">
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                            <span className="star">⭐</span>
                        </div>
                        <p className="review-text">
                            "Professional eyebrow shaping service. Perfect for maintaining a clean, 
                            professional look. The attention to detail is outstanding."
                        </p>
                        <div className="review-footer">
                            <span className="review-service">Eyebrow Shaping</span>
                        </div>
                    </div>
                </div>
                
                <div className="add-review-section">
                    <h3 className="add-review-title">Experience Our Services</h3>
                    <p className="add-review-text">
                        Ready to join our satisfied customers? Book your appointment today and 
                        experience the professional grooming services that our clients love.
                    </p>
                    <Link to={`/booker?tenant=${getTenantFromUrl()}`} className="book-now-btn">Book Now</Link>
                </div>
            </div>
        </div>
    )
}

export default Reviews;