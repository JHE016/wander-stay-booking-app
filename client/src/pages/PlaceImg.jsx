export default function PlaceImg({ place, index = 0, className = null }) {
    if (!place.photos?.length) {
        return <div className="w-full h-full bg-gray-300 rounded-2xl" />;  // Placeholder if no image available
    }
    if (!className) {
        className = 'object-cover';
    }
    return (
        <img className={className} src={`/images/${place.photos[index]}`} alt={place.title} />
    );
}
