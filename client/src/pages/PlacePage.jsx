import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { perkIcons } from "../Perks";

export default function PlacesPage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`${import.meta.env.VITE_API_URL}/places/${id}`).then(response => {
            setPlace(response.data);
        });
    }, [id]);

    if (!place) return '';

    const uniquePerks = [...new Set(place.perks)];

    return (
        <div className="mt-8 bg-white-100 flex justify-center">
            <div className="bg-white p-8 max-w-7xl w-full relative">
                <hr className="border-gray-300 mx-0" style={{ margin: '0 -9999px', height: '1px' }} />
                <div className="p-4">
                    <h1 className="text-3xl font-semibold leading-tight">{place.title}</h1>
                    <a className="flex gap-1 my-2 block font-semibold underline" target="_blank" href={`http://maps.google.com/?q=${place.address}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {place.address}
                    </a>
                </div>
                <div className="relative">
                    <div className="grid gap-2 grid-cols-3 mt-4">
                        <div className="col-span-2">
                            {place.photos?.[0] && (
                                <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer w-full h-full object-cover rounded-2xl" src={`/images/${place.photos[0]}`} alt="Photo 1" />
                            )}
                        </div>
                        <div className="grid gap-2 grid-rows-2">
                            {place.photos?.[1] && (
                                <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer w-full h-full object-cover rounded-2xl" src={`/images/${place.photos[1]}`} alt="Photo 2" />
                            )}
                            {place.photos?.[2] && (
                                <img onClick={() => setShowAllPhotos(true)} className="cursor-pointer w-full h-full object-cover rounded-2xl" src={`/images/${place.photos[2]}`} alt="Photo 3" />
                            )}
                        </div>
                    </div>
                    <button onClick={() => setShowAllPhotos(true)} className="absolute bottom-4 right-4 bg-white text-black border border-gray-300 px-4 py-2 rounded-lg shadow-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
                        </svg>
                        Show all photos
                    </button>
                </div>
                <div className="flex justify-between mt-8">
                    <div className="w-2/3">
                        <div className="mt-8 p-4 bg-white-100 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4">About this place</h2>
                            <p className="text-lg">{place.description}</p>
                        </div>
                        <div className="bg-gray-200 shadow p-4 mt-4 shadow rounded-2xl">
                            <div>
                                Check-in time: {place.checkIn}:00 pm <br />
                                Check-out time: {place.checkOut}:00 am <br />
                                Max number of guests: {place.maxGuests}
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3">
                        <ReservationBox 
                            price={place.price}
                            placeId={place._id} 
                        />
                    </div>
                </div>
                <div>
                    {place.extraInfo && place.extraInfo.trim() && (
                        <>
                            <h2 className="mt-6 text-2xl font-semibold mb-4">Extra Information</h2>
                            <p className="text-lg">{place.extraInfo}</p>
                        </>
                    )}
                </div>
                <div className="mt-8">
                    {uniquePerks?.length > 0 && (
                        <>
                            <h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {uniquePerks.map((perk, index) => (
                                    <div key={index} className="flex items-center gap-2 p-4 border rounded-lg">
                                        {perkIcons[perk]}
                                        <span className="text-lg font-medium">{perk}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {showAllPhotos && (
                    <PhotosOverlay
                        photos={place.photos}
                        onClose={() => setShowAllPhotos(false)}
                        placeTitle={place.title}
                    />
                )}
            </div>
        </div>
    );
}

function PhotosOverlay({ photos, onClose, placeTitle }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 left-4 bg-white text-black border border-gray-300 px-4 py-2 rounded-lg shadow-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Close photos
            </button>
            <div className="flex flex-col items-center p-8 space-y-4">
                <h2 className="text-3xl mb-4 text-white">Photos of {placeTitle}</h2>
                {photos?.length > 0 && photos.map((photo, index) => (
                    <div key={index} className="w-full max-w-4xl mb-4">
                        <img className="w-full object-cover rounded-lg" src={`/images/${photo}`} alt={`Photo ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReservationBox({ price, placeId }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [nights, setNights] = useState(0);
    const [unit, setUnit] = useState(1);
    const [userName, setUserName] = useState('');
    const [redirect, setRedirect] = useState('');
    const cleaningFee = 40;
    const serviceFee = 160;

    useEffect(() => {
        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            const differenceInTime = checkOutDate - checkInDate;
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);
            setNights(differenceInDays);
        }
    }, [checkIn, checkOut]);

    const totalPrice = (price * nights * unit) + (cleaningFee * nights * unit) + serviceFee;

    function bookThisPlace() {
        const data = {
            checkIn, 
            checkOut, 
            numberOfGuests, 
            userName,
            place: placeId,
            price: totalPrice,
            unit,
        };

        axios.post(`${import.meta.env.VITE_API_URL}/bookings`, data, { withCredentials: true })
            .then(response => {
                const bookingId = response.data._id;
                setRedirect(`/account/bookings/${bookingId}`);
            })
            .catch(error => {
                console.error(error);
            });
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="bg-white p-4 border rounded-lg shadow-lg w-80 ml-8 sticky top-20 self-start">
            <div className="text-2xl font-semibold mb-4">${price} / night</div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Check-in</label>
                <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Check-out</label>
                <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Number of guests</label>
                <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Unit</label>
                <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                />
            </div>
            <button onClick={bookThisPlace} className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full text-center text-lg font-semibold">
                Reserve
            </button>
            <div className="text-sm text-center mt-2">You won't be charged yet</div>
            <div className="mt-4">
                <div className="flex justify-between text-lg">
                    <span>${price} x {nights} nights x {unit} unit(s)</span>
                    <span>${price * nights * unit}</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span>Cleaning Fee</span>
                    <span>${cleaningFee * nights * unit}</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span>Service fee</span>
                    <span>${serviceFee}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-semibold">
                    <span>Total before taxes</span>
                    <span>${totalPrice}</span>
                </div>
            </div>
        </div>
    );
}
