import { useState, useRef } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 50.0755,  // Praha
  lng: 14.4378
};

function GoogleMapComponent() {
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [showDirections, setShowDirections] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [apiLoaded, setApiLoaded] = useState(false); // State to check if API is loaded

  const originRef = useRef(null);
  const destinationRef = useRef(null);

  const directionsCallback = (response) => {
    if (response !== null && response.status === 'OK') {
      setDirections(response);
      setRouteInfo({
        distance: response.routes[0].legs[0].distance.text,
        duration: response.routes[0].legs[0].duration.text,
      });
      setError(null);
      setShowDirections(false);
    } else if (response) {
      setError('Chyba při získávání trasy: ' + response.status);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin && destination) {
      setShowDirections(true);
      setDirections(null);
      setError(null);
    } else {
      setError('Zadejte obě místa.');
    }
  };

  const handlePlaceChanged = () => {
    const originPlace = originRef.current.getPlace();
    const destinationPlace = destinationRef.current.getPlace();
    if (originPlace) setOrigin(originPlace.formatted_address);
    if (destinationPlace) setDestination(destinationPlace.formatted_address);
  };

  return (
    <LoadScript 
      libraries={["places"]} 
      onLoad={() => setApiLoaded(true)} // Set API as loaded once it's ready
    >
      {apiLoaded && ( // Render only after API has loaded
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold my-4">Plánovač trasy</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="origin" className="block text-lg">Výchozí místo:</label>
              <Autocomplete onLoad={(autocomplete) => (originRef.current = autocomplete)} onPlaceChanged={handlePlaceChanged}>
                <input
                  type="text"
                  id="origin"
                  className="w-full border px-3 py-2"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </Autocomplete>
            </div>
            <div>
              <label htmlFor="destination" className="block text-lg">Cílové místo:</label>
              <Autocomplete onLoad={(autocomplete) => (destinationRef.current = autocomplete)} onPlaceChanged={handlePlaceChanged}>
                <input
                  type="text"
                  id="destination"
                  className="w-full border px-3 py-2"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </Autocomplete>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Zobrazit trasu</button>
            {error && <p className="text-red-500">{error}</p>}
          </form>

          {routeInfo && (
            <div className="my-4">
              <p><strong>Vzdálenost:</strong> {routeInfo.distance}</p>
              <p><strong>Čas jízdy:</strong> {routeInfo.duration}</p>
            </div>
          )}

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            {directions && (
              <DirectionsRenderer
                options={{ directions }}
              />
            )}
            {showDirections && (
              <DirectionsService
                options={{
                  destination,
                  origin,
                  travelMode
                }}
                callback={directionsCallback}
              />
            )}
          </GoogleMap>
        </div>
      )}
    </LoadScript>
  );
}

export default GoogleMapComponent;
