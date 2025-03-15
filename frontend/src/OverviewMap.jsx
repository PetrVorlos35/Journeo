import { GoogleMap, MarkerF, DirectionsRenderer } from '@react-google-maps/api';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TripBudgetTracking from './TripBudgetTracking';
import { format } from 'date-fns';
import { cs, enUS } from 'date-fns/locale';
import { useReactToPrint } from 'react-to-print';



const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 50.0755, // Praha jako výchozí souřadnice
  lng: 14.4378,
};

const OverviewMap = ({ tripId, userId, allPlans, onClose, tripName }) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [directionsResponses, setDirectionsResponses] = useState([]);
  const [dayColors, setDayColors] = useState([]);
  const [locations, setLocations] = useState([]);
  const mapRef = useRef(null);
  const { t, i18n } = useTranslation();
  const contentRef = useRef(null);


  const reactToPrintFn = useReactToPrint({ 
    contentRef,
    documentTitle: "trip_overview",
    pageStyle: `
    @page { 
      size: A4; 
      margin: 20mm; 
    } 
    body { 
      font-size: 14px; 
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    .print-section {
      page-break-before: always !important; /* Each section starts on a new page */
      display: block;
    }
    .no-print { 
      display: none !important; 
    }
  `,
   });

  

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

  const generateRandomColors = (count) => {
    const colors = [];

    for (let i = 0; i < count; i++) {
      let color;
      do {
        color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      } while (!isColorVisible(color));

      colors.push(color);
    }

    return colors;
  };


  const isColorVisible = (hex) => {
    const rgb = hexToRgb(hex);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness < 200;
  };


  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.substring(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  };



  useEffect(() => {
    if (allPlans.length > 0) {
      const directionsService = new google.maps.DirectionsService();
      const bounds = new google.maps.LatLngBounds();

      const colors = generateRandomColors(allPlans.length);
      setDayColors(colors);

      allPlans.forEach((plan, index) => {
        if (plan.route.start && plan.route.end) {
          const route = {
            origin: plan.route.start,
            destination: plan.route.end,
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: plan.route.stops.map(stop => ({ location: stop, stopover: true })),
          };

          directionsService.route(route, (result, status) => {
            if (status === 'OK') {
              setDirectionsResponses(prev => [...prev, { response: result, color: colors[index % colors.length] }]);
              result.routes[0].legs.forEach(leg => {
                bounds.extend(leg.start_location);
                bounds.extend(leg.end_location);
              });
            }
          });
        }
      });

      const geocoder = new google.maps.Geocoder();
      const tempLocations = [];

      allPlans.forEach((plan, index) => {
        if (plan.location) {
          geocoder.geocode({ address: plan.location }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const loc = results[0].geometry.location;
              tempLocations.push({ location: loc, day: index + 1 });
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






  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4 sm:p-0">
      <div  className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full h-full sm:w-4/5 sm:max-w-4xl sm:h-auto sm:max-h-[95vh] overflow-y-auto relative dark:text-white dark:bg-gray-800">
      <div ref={contentRef}>


      <button className='no-print text-black dark:text-white hover:text-blue-500' onClick={() => reactToPrintFn()}>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.5488 84.7168" width="24" height="24">
          <g>
            <rect height="84.7168" opacity="0" width="87.5488" x="0" y="0"/>
            <path d="M72.2656 12.8906L72.2656 14.3555L65.5273 14.3555L65.5273 12.3535C65.5273 9.47266 63.916 7.91016 60.9863 7.91016L26.5625 7.91016C23.6328 7.91016 22.0215 9.47266 22.0215 12.3535L22.0215 14.3555L15.2344 14.3555L15.2344 12.8906C15.2344 5.0293 19.6777 1.5625 26.6602 1.5625L60.8887 1.5625C68.3105 1.5625 72.2656 5.0293 72.2656 12.8906Z" fill="currentColor" />
            <path d="M87.5488 26.0254L87.5488 61.8164C87.5488 69.5312 83.3984 73.4863 75.6836 73.4863L71.9727 73.4863L71.9727 66.8945L75.7812 66.8945C78.8086 66.8945 80.4688 65.2344 80.4688 62.1582L80.4688 25.6836C80.4688 22.6562 78.8086 20.9473 75.7812 20.9473L11.7676 20.9473C8.74023 20.9473 7.03125 22.6562 7.03125 25.6836L7.03125 62.1582C7.03125 65.2344 8.74023 66.8945 11.7676 66.8945L15.5762 66.8945L15.5762 73.4863L11.8652 73.4863C4.15039 73.4863 0 69.5312 0 61.8164L0 26.0254C0 18.3105 4.58984 14.3555 11.8652 14.3555L75.6836 14.3555C83.3984 14.3555 87.5488 18.3105 87.5488 26.0254ZM72.2656 29.834C72.2656 32.5195 70.1172 34.7168 67.4316 34.7168C64.7461 34.7168 62.5977 32.5195 62.5977 29.834C62.5977 27.1973 64.7461 25 67.4316 25C70.1172 25 72.2656 27.1973 72.2656 29.834Z" fill="currentColor" />
            <path d="M22.7051 84.7168L64.8438 84.7168C69.5312 84.7168 71.9727 82.5684 71.9727 77.5879L71.9727 45.8496C71.9727 40.8691 69.5312 38.7207 64.8438 38.7207L22.7051 38.7207C18.3105 38.7207 15.5762 40.8691 15.5762 45.8496L15.5762 77.5879C15.5762 82.5684 18.0176 84.7168 22.7051 84.7168ZM25 78.1738C23.4863 78.1738 22.6074 77.3438 22.6074 75.7324L22.6074 47.6562C22.6074 46.0938 23.4863 45.2637 25 45.2637L62.5488 45.2637C64.1113 45.2637 64.8926 46.0938 64.8926 47.6562L64.8926 75.7324C64.8926 77.3438 64.1113 78.1738 62.5488 78.1738ZM31.1035 57.7148L56.543 57.7148C58.0566 57.7148 59.1797 56.543 59.1797 55.0293C59.1797 53.5645 58.0566 52.4414 56.543 52.4414L31.1035 52.4414C29.541 52.4414 28.3691 53.5645 28.3691 55.0293C28.3691 56.543 29.541 57.7148 31.1035 57.7148ZM31.1035 70.9961L56.543 70.9961C58.0566 70.9961 59.1797 69.873 59.1797 68.4082C59.1797 66.8945 58.0566 65.7227 56.543 65.7227L31.1035 65.7227C29.541 65.7227 28.3691 66.8945 28.3691 68.4082C28.3691 69.873 29.541 70.9961 31.1035 70.9961Z" fill="currentColor" />
          </g>
        </svg>
      </button>
      <button
        className="no-print absolute top-4 right-4 text-gray-700 cursor-pointer dark:text-white dark:hover:text-red-500 hover:text-red-500 transition-all duration-200"
        onClick={onClose}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 61.3893 61.4014"
          width="24"
          height="24"
          fill="currentColor"
        >
          <g>
            <rect height="61.4014" opacity="0" width="61.3893" x="0" y="0" />
            <path d="M1.15364 60.2661C2.71614 61.7798 5.2552 61.7798 6.76887 60.2661L30.6947 36.2915L54.6693 60.2661C56.1341 61.7798 58.722 61.7798 60.2357 60.2661C61.7493 58.7036 61.7493 56.1646 60.2357 54.6997L36.2611 30.7251L60.2357 6.79932C61.7493 5.28564 61.7982 2.69775 60.2357 1.18408C58.6732-0.280762 56.1341-0.280762 54.6693 1.18408L30.6947 25.1587L6.76887 1.18408C5.2552-0.280762 2.66731-0.32959 1.15364 1.18408C-0.311207 2.74658-0.311207 5.28564 1.15364 6.79932L25.1282 30.7251L1.15364 54.6997C-0.311207 56.1646-0.360035 58.7524 1.15364 60.2661Z" />
          </g>
        </svg>
      </button>

        <div className="print-section">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center ">{t('tripOverview')} {tripName}</h2>

        <h3 className="text-xl font-semibold mt-4">{t('dailyPlan')}</h3>
        <ul className="list-disc ml-6">
          {allPlans.map((plan, index) => (
            <li key={index}>
              <span className="inline-flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: dayColors[index] }}
                />
                <strong>
                  {plan.title} - {format(new Date(plan.date), 'EEEE, dd.MM.yyyy', { locale: getLocale() })}
                </strong>
              </span>
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
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={10}
            onLoad={(map) => (mapRef.current = map)}
            options={{ streetViewControl: false, fullscreenControl: false, zoomControl: true }}
          >
            {directionsResponses.map((item, index) => (
              <DirectionsRenderer
                key={index}
                directions={item.response}
                options={{ polylineOptions: { strokeColor: item.color, strokeWeight: 4 } }}
              />
            ))}
            {locations.map((loc, index) => (
              <MarkerF key={index} position={loc.location} label={`${loc.day}`} />
            ))}
          </GoogleMap>
        </div>
        </div>



        <div className="print-section">
        <h3 className="text-xl font-semibold mt-4">{t('budget')}</h3>
        <TripBudgetTracking userId={userId} tripId={tripId}/>
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
