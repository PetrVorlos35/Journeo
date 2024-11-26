import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 50.0755, // Výchozí souřadnice (např. Praha)
  lng: 14.4378,
};

const MapComponent = ({ location, route, clearMap }) => {

    const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const mapOptions = {
    streetViewControl: false,
    fullscreenControl: false,
  };

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setMapCenter(userLocation);
          },
          (error) => {
            console.error("Error fetching user location:", error);
          }
        );
      }
    if (clearMap) {
        setDirectionsResponse(null); // Vyčisti trasu
        setMapCenter(defaultCenter); // Resetuj mapu na výchozí pozici
    } else if (location) {
        // Pokud je zadaná lokace, přesuňte centrum mapy na lokaci
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: location }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setMapCenter(results[0].geometry.location);
          }
        });
    } else if (route) {
         // Pokud je zadaná trasa, vypočítejte trasu
         const directionsService = new google.maps.DirectionsService();
         directionsService
           .route({
             origin: route.start,
             destination: route.end,
             travelMode: google.maps.TravelMode.DRIVING,
             waypoints: route.stops.map((stop) => ({ location: stop, stopover: true })),
             provideRouteAlternatives: true,
           })
           .then((result) => setDirectionsResponse(result))
           .catch((err) => console.error("Error calculating route:", err));
    }
}, [clearMap, location, route]);


//   useEffect(() => {
//     if (clearMap) {
//         setDirectionsResponse(null);
//         setMapCenter(defaultCenter);
//     }else{
//         if (location) {
//           // Pokud je zadaná lokace, přesuňte centrum mapy na lokaci
//           const geocoder = new google.maps.Geocoder();
//           geocoder.geocode({ address: location }, (results, status) => {
//             if (status === 'OK' && results[0]) {
//               setMapCenter(results[0].geometry.location);
//             }
//           });
//         } else if (route.start && route.end) {
//           // Pokud je zadaná trasa, vypočítejte trasu
//           const directionsService = new google.maps.DirectionsService();
//           directionsService
//             .route({
//               origin: route.start,
//               destination: route.end,
//               travelMode: google.maps.TravelMode.DRIVING,
//               waypoints: route.stops.map((stop) => ({ location: stop, stopover: true })),
//             })
//             .then((result) => setDirectionsResponse(result))
//             .catch((err) => console.error("Error calculating route:", err));
//         }
//     }
//   }, [clearMap, location, route]);

  return (
      <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={location ? 13 : 10} options={mapOptions}>
        {/* Zobrazení markeru pro lokaci */}
        {location && <Marker position={mapCenter} />}
        {/* Zobrazení trasy */}
        {route.start && route.end && directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
  );
};
MapComponent.propTypes = {
  location: PropTypes.string,
  route: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    stops: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  clearMap: PropTypes.bool.isRequired,
};

export default MapComponent;