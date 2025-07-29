import { Link } from "react-router-dom";

function Home() {

    return (
        <div>
        <p>Welcome, Guest</p>
        <h2>Barber lookup</h2>
        <input type="text" placeholder="Enter barber name" />
        <Link to="/barber-profile"><button>Search</button></Link>
        </div>
    )
}

export default Home;