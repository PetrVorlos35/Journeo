import { GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TripBudgetTracking from './TripBudgetTracking';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 50.0755, // Praha jako výchozí souřadnice
  lng: 14.4378,
};

const OverviewMap = ({ tripId, userId, allPlans, onClose }) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [directionsResponses, setDirectionsResponses] = useState([]);
  const [locations, setLocations] = useState([]);
  const mapRef = useRef(null);

  const { t } = useTranslation();


   // Zablokování scrollování při otevření modalu
   useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto'; // Obnovení scrollu po zavření modalu
    };
  }, []);

  useEffect(() => {
    if (allPlans.length > 0) {
      const directionsService = new google.maps.DirectionsService();
      const bounds = new google.maps.LatLngBounds();

      const allRoutes = allPlans
        .filter(plan => plan.route.start && plan.route.end) // Jen platné trasy
        .map(plan => ({
          origin: plan.route.start,
          destination: plan.route.end,
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints: plan.route.stops.map(stop => ({ location: stop, stopover: true })),
        }));

      if (allRoutes.length > 0) {
        allRoutes.forEach(route => {
          directionsService.route(route, (result, status) => {
            if (status === 'OK') {
              setDirectionsResponses(prev => [...prev, result]);
              result.routes[0].legs.forEach(leg => {
                bounds.extend(leg.start_location);
                bounds.extend(leg.end_location);
              });
            }
          });
        });
      }

      // Přidání jednotlivých lokací do mapy
      const geocoder = new google.maps.Geocoder();
      const tempLocations = [];

      allPlans.forEach(plan => {
        if (plan.location) {
          geocoder.geocode({ address: plan.location }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const loc = results[0].geometry.location;
              tempLocations.push(loc);
              bounds.extend(loc);
              setLocations([...tempLocations]); // Aktualizuj lokace v state
            }
          });
        }
      });

      // Počkej na načtení všech bodů a potom centrovat mapu
      setTimeout(() => {
        if (!bounds.isEmpty() && mapRef.current) {
          mapRef.current.fitBounds(bounds);
        }
      }, 1000);
    }
  }, [allPlans]);

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-0">
  <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg 
    w-full h-full sm:w-4/5 sm:max-w-4xl sm:h-auto 
    sm:max-h-[95vh] overflow-y-auto relative">
    
    {/* Zavírací tlačítko */}
    <button
      className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition-all duration-200"
      onClick={onClose}
    >
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3893 61.4014" className="h-8 w-8">
        <g>
          <rect height="61.4014" opacity="0" width="61.3893" x="0" y="0" />
          <path
            d="M1.15364 60.2661C2.71614 61.7798 5.2552 61.7798 6.76887 60.2661L30.6947 36.2915L54.6693 60.2661C56.1341 61.7798 58.722 61.7798 60.2357 60.2661C61.7493 58.7036 61.7493 56.1646 60.2357 54.6997L36.2611 30.7251L60.2357 6.79932C61.7493 5.28564 61.7982 2.69775 60.2357 1.18408C58.6732-0.280762 56.1341-0.280762 54.6693 1.18408L30.6947 25.1587L6.76887 1.18408C5.2552-0.280762 2.66731-0.32959 1.15364 1.18408C-0.311207 2.74658-0.311207 5.28564 1.15364 6.79932L25.1282 30.7251L1.15364 54.6997C-0.311207 56.1646-0.360035 58.7524 1.15364 60.2661Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </button>

    {/* Nadpis */}
    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">{t('tripOverview')}</h2>


    {/* Google Mapa */}
    <div className="mb-4">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '50vh' }} // Lepší velikost pro různé obrazovky
        center={mapCenter}
        zoom={10}
        onLoad={(map) => (mapRef.current = map)}
        options={{
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
        }}
      >
        {/* Vykreslení tras */}
        {directionsResponses.map((response, index) => (
          <DirectionsRenderer key={index} directions={response} />
        ))}

        {/* Vykreslení jednotlivých bodů na mapě */}
        {locations.map((loc, index) => (
          <MarkerF key={index} position={loc} />
        ))}
      </GoogleMap>


        {/* Rozpočet výletu */}
        <div className="mt-4">
          <TripBudgetTracking userId={userId} tripId={tripId} />
        </div>
    </div>
  </div>
</div>


  );
};

OverviewMap.propTypes = {
  allPlans: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  tripId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
};

export default OverviewMap;
