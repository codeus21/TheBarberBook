import { Link } from "react-router-dom";

function Confirmation(){

    return(
        <div>
            <h1>Confirmation</h1>
            <div>Barber:</div>
            <div>Service:</div>
            <div>Date:</div>
            <div>Time:</div>
            <Link to="/"><button>Done</button></Link>
        </div>
    )
}

export default Confirmation;