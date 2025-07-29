import { useContext, useState } from 'react';
import { nameContext } from '../App';

function Home() {
    const nameHolder = useContext(nameContext);

    return (
        <div>
        <h1>The Barber Book</h1>
        <p>Welcome, {nameHolder.name}</p>
        <h2>Barber lookup</h2>
        <input type="text" placeholder="Enter barber name" />
        <button>Search</button>
        </div>
    )
}

export default Home;