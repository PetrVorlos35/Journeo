import { GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 50.0755, // Praha
  lng: 14.4378,
};


// Dark mode styl pro Google Mapu
const darkModeStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#bdbdbd' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#424242' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#1f1f1f' }],
  },
];

const MapComponent = ({ location, route, clearMap, isDarkMode }) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const { t } = useTranslation();

  // Nastavení mapOptions s podporou Dark Mode
  const mapOptions = {
    streetViewControl: false,
    fullscreenControl: false,
    styles: isDarkMode ? darkModeStyle : [], // Přepínání mezi světlým a tmavým režimem
  };

  

  useEffect(() => {
    if (!isDarkMode) return; // Aplikuje styly jen když je dark mode aktivní
  
    const interval = setInterval(() => {
      const buttons = document.querySelectorAll('.gm-style-mtc button, .gmnoprint button');
      const fullscreenBtn = document.querySelector('.gm-fullscreen-control');
      const zoomControls = document.querySelectorAll('.gmnoprint[controlwidth="40"] button');
  
      buttons.forEach(button => {
        button.style.background = '#1f1f1f';
        button.style.color = 'white';
        button.style.border = '1px solid #444';
      });
  
      zoomControls.forEach(button => {
        button.style.background = '#1f1f1f';
        button.style.color = 'white';
        button.style.border = '1px solid #444';
      });
  
      if (fullscreenBtn) {
        fullscreenBtn.style.background = '#1f1f1f';
        fullscreenBtn.style.border = '1px solid #444';
        fullscreenBtn.style.color = 'white';
      }
    }, 500); // Opakuje se každých 500ms, dokud nenajde prvky
  
    return () => clearInterval(interval); // Vyčistí interval při odmontování komponenty
  }, [isDarkMode]); // Bude se aplikovat jen při změně dark mode
  

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
    if (clearMap) {
      setDirectionsResponse(null);
      setMapCenter(defaultCenter);
    } else if (location) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setMapCenter(results[0].geometry.location);
        }
      });
    } else if (route) {
      const directionsService = new google.maps.DirectionsService();
      directionsService
        .route({
          origin: route.start,
          destination: route.end,
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints: route.stops.map((stop) => ({ location: stop, stopover: true })),
          provideRouteAlternatives: true,
        })
        .then((result) => {
          setDirectionsResponse(result);
          if (result.routes.length > 0) {
            const routeLegs = result.routes[0].legs;
            const totalDistance = routeLegs.reduce((acc, leg) => acc + leg.distance.value, 0);
            const totalDuration = routeLegs.reduce((acc, leg) => acc + leg.duration.value, 0);

            setRouteInfo({
              distance: (totalDistance / 1000).toFixed(1) + " km",
              duration: Math.floor(totalDuration / 3600) + " h " + Math.floor((totalDuration % 3600) / 60) + " min",
            });

            const waypointsParam = route.stops.length > 0 ? `&waypoints=${route.stops.map(stop => encodeURIComponent(stop)).join('|')}` : '';
            setGoogleMapsLink(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(route.start)}&destination=${encodeURIComponent(route.end)}&travelmode=driving${waypointsParam}`);
          }
        })
        .catch((err) => console.error("Error calculating route:", err));
    }
  }, [clearMap, location, route]);

  return (
    <div className="relative">
      {route?.start && route?.end && routeInfo && (
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-2 z-50 rounded-md shadow-md text-sm text-black dark:text-white">
          <p><strong>{t('distance')}:</strong> {routeInfo.distance}</p>
          <p><strong>{t('drivingTime')}:</strong> {routeInfo.duration}</p>
          <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {t('openInMaps')}
          </a>
        </div>
      )}
      <GoogleMap  key={isDarkMode} mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={location ? 13 : 10} options={mapOptions}>
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
  isDarkMode: PropTypes.bool.isRequired, // Nový prop pro detekci dark mode
};

export default MapComponent;
