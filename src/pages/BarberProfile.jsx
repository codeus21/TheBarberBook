import { Link } from "react-router-dom";

function BarberProfile() {
    return (
        <div>
            <div>
                <h1>Barber Profile</h1>
                <p>Barber image: </p>
                <p>Barber name: </p>
                <p>Barber bio: </p>
                <p>Barber address: </p>
                <p>Barber phone: </p>
                <p>Barber email: </p>
                <p>Barber hours: </p>
                <div>
                <Link to="/booker"><button>Book Now</button></Link>
                </div>
            </div>
        </div>
    )
}

export default BarberProfile;