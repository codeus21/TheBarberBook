import { Link } from "react-router-dom";

function Booker() {

    return(
    <>
    <div>
        Select Appointment:
        <div>
            Service:
        </div>
        <div>
            Date:
        </div>
        <div>
            Time:
        </div>
    </div>
    <Link to="/confirmation"><button>Book</button></Link>
    </>
    )
}

export default Booker;