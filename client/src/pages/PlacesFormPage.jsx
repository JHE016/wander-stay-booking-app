import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [price, setPrice] = useState(100);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`${import.meta.env.VITE_API_URL}/places/${id}`).then(response => {
            const { data } = response;
            setTitle(data.title);
            setAddress(data.address);
            setCity(data.city);
            setPhone(data.phone);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        });
    }, [id]);

    function inputHeader(text) {
        return <h2 className="text-2xl mt-4">{text}</h2>;
    }

    function inputDescription(text) {
        return <p className="text-gray-500 text-sm">{text}</p>;
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    async function savePlace(ev) {
        ev.preventDefault();
        const placeData = {
            title,
            address,
            city,
            phone,
            addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price,
        };
        if (id) {
            // Update
            await axios.put(`${import.meta.env.VITE_API_URL}/places`, { id, ...placeData });
            setRedirect(true);
        } else {
            // New place
            await axios.post(`${import.meta.env.VITE_API_URL}/places`, placeData);
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />;
    }

    return (
        <div>
            <AccountNav />
            <form onSubmit={savePlace}>
                {preInput('Title', 'Title for your place. Should be catchy as in advertisement')}
                <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Title, for example: My apartment" />
                {preInput('Address', 'Address to this place')}
                <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Address" />
                {preInput('City', 'City where the place is located')}
                <input type="text" value={city} onChange={ev => setCity(ev.target.value)} placeholder="City" />
                {preInput('Phone number', 'Contact information')}
                <input type="text" value={phone} onChange={ev => setPhone(ev.target.value)} placeholder="Phone" />
                {preInput('Photos', 'More = better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                {preInput('Description', 'Description of the place')}
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                {preInput('Perks', 'Select all the perks of your place')}
                <Perks selected={perks} onChange={setPerks} />
                {preInput('Extra info', 'House rules and extra information')}
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                {preInput('Check in & out time, max guests', 'Add check in and out times, have time window for cleaning between guests')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input
                            type="text"
                            value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)}
                            placeholder="14:00"
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time</h3>
                        <input
                            type="text"
                            value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)}
                            placeholder="11:00"
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                        <input
                            type="number"
                            value={maxGuests}
                            onChange={ev => setMaxGuests(ev.target.value)}
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input
                            type="number"
                            value={price}
                            onChange={ev => setPrice(ev.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <button className="primary my-4">Save</button>
                </div>
            </form>
        </div>
    );
}
