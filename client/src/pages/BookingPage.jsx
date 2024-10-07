import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PlaceImg from "./PlaceImg";
import { differenceInCalendarDays } from 'date-fns';

export default function BookingPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get(`${import.meta.env.VITE_API_URL}/bookings`, { withCredentials: true })
                .then(response => {
                    const foundBooking = response.data.find(booking => booking._id === id);
                    if (foundBooking) {
                        setBooking(foundBooking);
                    }
                })
                .catch(error => {
                    console.error("There was an error fetching the booking!", error);
                });
        }
    }, [id]);

    if (!booking) {
        return <div>Loading...</div>;
    }

    const isBookingCompleted = (checkOutDate) => {
        const today = new Date();
        const checkOut = new Date(checkOutDate);
        return checkOut < today;
    };

    const nights = differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn));
    const tax = (booking.price * 0.07).toFixed(0);
    const tourismFee = (10 * booking.unit * nights).toFixed(0);
    const municipalityFee = (booking.price * 0.05).toFixed(0);
    const totalPrice = (booking.price + parseFloat(tax) + parseFloat(tourismFee) + parseFloat(municipalityFee)).toFixed(0);

    return (
        <div className="p-4">
            <div className="bg-gray-200 p-4 rounded-lg shadow-md mb-4">
                <div className="flex justify-between">
                    <div className="flex">
                        <div className="w-32 h-32">
                            <PlaceImg place={booking.place} className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-2xl font-bold">{booking.place.title}</h1>
                            <p className="text-gray-600">{booking.place.address}</p>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="mr-8">
                                        <h3 className="text-lg font-bold">Check In</h3>
                                        <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-600">from {booking.place.checkIn}:00 </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Check Out</h3>
                                        <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-600">until {booking.place.checkOut}:00 </p>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <p><strong>Units:</strong> {booking.unit}</p>
                                    <p><strong>Nights:</strong> {nights}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="text-xl font-bold">PRICE</h2>
                    <p>1 unit: ${booking.price}</p>
                    <p>7% TAX: ${tax}</p>
                    <p>US$ 10 Tourism fee per night: ${tourismFee}</p>
                    <p>5% Municipality fee: ${municipalityFee}</p>
                    <p className="text-xl font-bold mt-2">Total: ${totalPrice}</p>
                </div>
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Payment Info</h2>
                    <p>{booking.place.title} handles all payments.</p>
                </div>
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Additional Info</h2>
                    <p>Note that additional supplements (e.g., an extra bed) aren't added in the total.</p>
                    <p>If you don't show up or cancel, applicable taxes may still be charged by the property.</p>
                </div>
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Status</h2>
                    <p>{isBookingCompleted(booking.checkOut) ? "Completed" : "Not Completed"}</p>
                </div>
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Map</h2>
                    <div>
                        <iframe
                            src={`https://www.google.com/maps?q=${booking.place.address}&output=embed`}
                            width="800"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="map"
                        ></iframe>
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Room Info</h2>
                    <p><strong>Guest name:</strong> {booking.userName}</p>
                </div>
            </div>
        </div>
    );
}
