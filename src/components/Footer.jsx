import '../css/Footer.css'

function Footer() {
    return(
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-title">Contact Us</h3>
                    <p className="footer-text">123 Main Street</p>
                    <p className="footer-text">Phone: 123-456-7890</p>
                    <p className="footer-text">Email: info@thebarberbook.com</p>
                </div>
                
                <div className="footer-section">
                    <h3 className="footer-title">Services</h3>
                    <a href="#" className="footer-link">Haircuts</a>
                    <a href="#" className="footer-link">Beard Trims</a>
                    <a href="#" className="footer-link">Shaves</a>
                    <a href="#" className="footer-link">Styling</a>
                </div>
                
                <div className="footer-section">
                    <h3 className="footer-title">Hours</h3>
                    <p className="footer-text">Monday - Friday: 8am - 8pm</p>
                    <p className="footer-text">Saturday - Sunday: Closed</p>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="footer-divider"></div>
                <p className="footer-copyright">© 2025 The Barber Book. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;