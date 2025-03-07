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
  height: '300px',
};

const defaultCenter = {
  lat: 50.0755, // Praha jako výchozí souřadnice
  lng: 14.4378,
};

const OverviewMap = ({ tripId, userId, allPlans, onClose }) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [directionsResponses, setDirectionsResponses] = useState([]);
  const [dayColors, setDayColors] = useState([]);
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
  
  
  
  const exportMapWithRoutes = async () => {
    return new Promise((resolve) => {
      const mapContainer = document.createElement('div');
      mapContainer.style.width = '800px';
      mapContainer.style.height = '600px';
      document.body.appendChild(mapContainer);
  
      const map = new google.maps.Map(mapContainer, {
        zoom: 10,
        center: mapCenter,
        disableDefaultUI: true,
      });
  
      // Přidání tras
      directionsResponses.forEach((item) => {
        new google.maps.DirectionsRenderer({
          map,
          directions: item.response,
          polylineOptions: { strokeColor: item.color, strokeWeight: 4 },
        });
      });
  
      // Přidání bodů
      locations.forEach((loc) => {
        new google.maps.Marker({
          position: loc.location,
          map,
          label: `${loc.day}`,
        });
      });
  
      setTimeout(() => {
        html2canvas(mapContainer, { useCORS: true }).then((canvas) => {
          document.body.removeChild(mapContainer);
          resolve(canvas.toDataURL('image/png'));
        });
      }, 1000);
    });
  };

  const exportChartAsImage = async () => {
    return new Promise((resolve) => {
      const chartCanvas = document.getElementById('trip-budget-chart');
      if (chartCanvas) {
        const imgData = chartCanvas.toDataURL('image/png');
        resolve(imgData);
      } else {
        resolve(null);
      }
    });
  };

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yPosition = 10;
  
    pdf.setFont('times', 'normal'); // ✅ Podpora češtiny
  
    pdf.setFontSize(18);
    pdf.text(t('tripOverview'), 105, yPosition, { align: 'center' });
    yPosition += 10;
  
    pdf.setFontSize(14);
    pdf.text(t('dailyPlan'), 10, yPosition);
    yPosition += 6;
  
    allPlans.forEach((plan, index) => {
      const dayText = `${t('day')} ${index + 1} - ${format(new Date(plan.date), 'EEEE, dd.MM.yyyy', { locale: getLocale() })}`;
      pdf.setFontSize(12);
      pdf.text(dayText, 10, yPosition);
      yPosition += 5;
  
      if (plan.plan && plan.plan.trim() !== "") {
        const wrappedText = pdf.splitTextToSize(plan.plan, 180);
        pdf.setFontSize(10);
        pdf.text(wrappedText, 15, yPosition);
        yPosition += wrappedText.length * 5;
      }
  
      if (plan.location && plan.location.trim() !== "") {
        pdf.text(`${t('location')}: ${plan.location}`, 15, yPosition);
      } else if (plan.route.start && plan.route.end) {
        pdf.text(`${t('route')}: ${plan.route.start} → ${plan.route.end} (${plan.route.stops.length} ${t('stops')})`, 15, yPosition);
      } else {
        pdf.text(t('noLocationOrRoute'), 15, yPosition);
      }
      yPosition += 8;
    });
  
    yPosition += 5;
    pdf.setFontSize(14);
    pdf.text(t('budget'), 10, yPosition);
    yPosition += 6;
  
    pdf.setFontSize(12);
    pdf.text(t('budgetPlaceholder'), 15, yPosition);
    yPosition += 10;
  
    pdf.setFontSize(14);
    pdf.text(t('mapOverview'), 10, yPosition);
    yPosition += 6;
  
    // **Přidání statické mapy**
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=10&size=600x300&markers=color:red|label:A|${mapCenter.lat},${mapCenter.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
  
    const mapImg = new Image();
    mapImg.src = staticMapUrl;
    mapImg.onload = function () {
      pdf.addImage(mapImg, 'JPEG', 10, yPosition, 180, 90);
      yPosition += 100;
  
      // **Přidání grafu**
      pdf.setFontSize(14);
      pdf.text(t('budgetGraph'), 10, yPosition);
      yPosition += 6;
  
      const chartCanvas = document.getElementById('trip-budget-chart');
      if (chartCanvas) {
        const chartImage = chartCanvas.toDataURL('image/png');
        pdf.addImage(chartImage, 'PNG', 10, yPosition, 180, 80);
      }
  
      pdf.save('trip_overview.pdf');
    };
  };
  
  
 
  
  



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-0">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full h-full sm:w-4/5 sm:max-w-4xl sm:h-auto sm:max-h-[95vh] overflow-y-auto relative dark:text-white dark:bg-gray-800" ref={contentRef}>
        
        <button
          className="absolute top-4 right-4 text-gray-700 cursor-pointer dark:text-white dark:hover:text-red-500 hover:text-red-500 transition-all duration-200"
          onClick={onClose}
        >
          &#x2715;
        </button>
        
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center ">{t('tripOverview')}</h2>

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
                  {t('day')} {index + 1} - {format(new Date(plan.date), 'EEEE, dd.MM.yyyy', { locale: getLocale() })}
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
        
        <h3 className="text-xl font-semibold mt-4">{t('budget')}</h3>
        <TripBudgetTracking userId={userId} tripId={tripId} />
        
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={handleDownloadPDF}
        >
          {t('downloadPDF')}
        </button>
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
