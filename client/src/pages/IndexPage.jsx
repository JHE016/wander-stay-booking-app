import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/places`)
      .then(response => {
        setPlaces(response.data);
      })
      .catch(error => {
        console.error("Error fetching places:", error);
      });
  }, []);

  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
      {places.length > 0 && places.map(place => (
        <Link to={'/place/' + place._id} key={place._id}>
          <div className="flex flex-col items-start">
            <div className="mb-2 flex items-center flex-col">
              {place.photos?.[0] && (
                <img
                  className="rounded-2xl w-60 h-60 aspect-square object-cover"
                  src={`/images/${place.photos?.[0]}`}
                  alt={place.title}
                />
              )}
            </div>
            <h2 className="text-sm font-bold w-60 truncated">{place.title}</h2>
            <h3 className="text-sm text-gray-500">{place.address}</h3>
            <div className="mt-1">
              <span className="font-bold">${place.price} </span>per night
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
