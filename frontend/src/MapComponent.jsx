import { GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

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
  const [routeInfo, setRouteInfo] = useState(null);
  const [googleMapsLink, setGoogleMapsLink] = useState('');

  const { t } = useTranslation();


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
        }) .then((result) => {
          setDirectionsResponse(result);
        
          if (result.routes.length > 0) {
            const routeLegs = result.routes[0].legs;
        
            // Sečtení celkové vzdálenosti a doby trvání pro celou trasu
            const totalDistance = routeLegs.reduce((acc, leg) => acc + leg.distance.value, 0); // v metrech
            const totalDuration = routeLegs.reduce((acc, leg) => acc + leg.duration.value, 0); // v sekundách
        
            setRouteInfo({
              distance: (totalDistance / 1000).toFixed(1) + " km", // Převod na km
              duration: Math.floor(totalDuration / 3600) + " h " + Math.floor((totalDuration % 3600) / 60) + " min", // Převod na h:min
            });
        
            // Generování odkazu do Google Maps pro celou trasu
            const waypointsParam = route.stops.length > 0 ? `&waypoints=${route.stops.map(stop => encodeURIComponent(stop)).join('|')}` : '';
            const mapsLink = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(route.start)}&destination=${encodeURIComponent(route.end)}&travelmode=driving${waypointsParam}`;
            setGoogleMapsLink(mapsLink);
          }
        })
        
        .catch((err) => console.error("Error calculating route:", err));
    }
  }, [clearMap, location, route]);

  return (
    <div className="relative">
   {/* Zobrazení informací o trase */}
   {route?.start && route?.end && routeInfo && (
      <div className="absolute bottom-4 left-4 bg-white p-2 z-50 rounded-md shadow-md text-sm">
        <p><strong>{t('distance')}:</strong> {routeInfo.distance}</p>
        <p><strong>{t('drivingTime')}:</strong> {routeInfo.duration}</p>
        <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
        {t('openInMaps')}
        </a>
      </div>
    )}
  
      {/* Mapa */}
      <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={location ? 13 : 10} options={mapOptions}>
        {location && <MarkerF position={mapCenter} />}
        {route?.start && route?.end && directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </div>
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
