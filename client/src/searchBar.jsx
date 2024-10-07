import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
    const [location, setLocation] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);

    const handleSearch = () => {
        onSearch({ location, checkInDate, checkOutDate, guests });
    };

    return (
        <div className="bg-white p-4 border rounded-lg shadow-lg flex justify-between items-center">
            <input
                type="text"
                placeholder="Anywhere"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="p-2 border rounded-lg flex-1 mx-2"
            />
            <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="p-2 border rounded-lg mx-2"
            />
            <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="p-2 border rounded-lg mx-2"
            />
            <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="p-2 border rounded-lg mx-2"
            />
            <button
                onClick={handleSearch}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg"
            >
                <i className="fa fa-search"></i>
            </button>
        </div>
    );
}
