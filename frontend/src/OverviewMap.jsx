import { GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TripBudgetTracking from './TripBudgetTracking';
import { format } from 'date-fns';
import { cs, enUS } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const { t, i18n } = useTranslation();
  const contentRef = useRef(null);

  const getLocale = () => {
    switch (i18n.language) {
      case 'cs':
        return cs;
      case 'en':
      default:
        return enUS;
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (allPlans.length > 0) {
      const directionsService = new google.maps.DirectionsService();
      const bounds = new google.maps.LatLngBounds();

      const allRoutes = allPlans
        .filter(plan => plan.route.start && plan.route.end)
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

      const geocoder = new google.maps.Geocoder();
      const tempLocations = [];

      allPlans.forEach(plan => {
        if (plan.location) {
          geocoder.geocode({ address: plan.location }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const loc = results[0].geometry.location;
              tempLocations.push(loc);
              bounds.extend(loc);
              setLocations([...tempLocations]);
            }
          });
        }
      });

      setTimeout(() => {
        if (!bounds.isEmpty() && mapRef.current) {
          mapRef.current.fitBounds(bounds);
        }
      }, 1000);
    }
  }, [allPlans]);

  const handleDownloadPDF = () => {
    window.scrollTo(0, 0);  // Posunout na začátek, aby bylo vše vidět
    const input = contentRef.current;
    
    html2canvas(input, { 
        scale: 2, 
        useCORS: true,
        scrollX: 0, 
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('trip_overview.pdf');
    });
};



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-0">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full h-full sm:w-4/5 sm:max-w-4xl sm:h-auto sm:max-h-[95vh] overflow-y-auto relative dark:text-white dark:bg-gray-800" ref={contentRef}>
        
        <button
          className="absolute top-4 right-4 text-gray-700 dark:text-white dark:hover:text-red-500 hover:text-red-500 transition-all duration-200"
          onClick={onClose}
        >
          &#x2715;
        </button>
        
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center ">{t('tripOverview')}</h2>

        <h3 className="text-xl font-semibold mt-4">{t('dailyPlan')}</h3>
        <ul className="list-disc ml-6">
          {allPlans.map((plan, index) => (
            <li key={index}>
              <strong>{t('day')} {index + 1} - {format(new Date(plan.date), 'EEEE, dd.MM.yyyy', { locale: getLocale() })}:</strong>
              <p>{plan.plan && plan.plan.trim() !== "" ? plan.plan : t('noActivityPlanned')}</p>
              {plan.location && plan.location.trim() !== "" ? (
                <p><strong>{t('location')}:</strong> {plan.location}</p>
              ) : plan.route.start && plan.route.end ? (
                <p><strong>{t('route')}:</strong> {plan.route.start} → {plan.route.end} ({plan.route.stops.length} {t('stops')})</p>
              ) : (
                <p><strong>{t('noLocationOrRoute')}</strong></p>
              )}
            </li>
          ))}
        </ul>

        
        <h3 className="text-xl font-semibold mt-4">{t('mapOverview')}</h3>
        <div className="mb-4 h-64">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={10}
            onLoad={(map) => (mapRef.current = map)}
            options={{ streetViewControl: false, fullscreenControl: false, zoomControl: true }}
          >
            {directionsResponses.map((response, index) => (
              <DirectionsRenderer key={index} directions={response} />
            ))}
            {locations.map((loc, index) => (
              <MarkerF key={index} position={loc} />
            ))}
          </GoogleMap>
        </div>
        
        <h3 className="text-xl font-semibold mt-4">{t('budget')}</h3>
        <TripBudgetTracking userId={userId} tripId={tripId} />
        
        {/* <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={handleDownloadPDF}
        >
          {t('downloadPDF')}
        </button> */}
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
