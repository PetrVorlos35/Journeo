import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Funkce pro volání API Mapy.cz a získání trasy
async function planRoute(start, end) {
  const response = await fetch('https://api.mapy.cz/v1/route', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': '8yCaLk5onpdy8bPw1JWhkS5YOjbzujCXNWc7ZojKMlQ', // Zde vložte svůj API klíč
    },
    body: JSON.stringify({
      start: `${start.lat},${start.lng}`,
      end: `${end.lat},${end.lng}`,
      vehicle: 'car', // Můžete změnit na 'foot', 'bike', apod.
    }),
  });

  const data = await response.json();
  return data.routes[0]; // Vrátí první trasu z odpovědi API
}

const SeznamMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) { // Pokud ještě nebyla mapa inicializována
      const map = L.map('mymap').setView([50.0755, 14.4378], 13); // Praha
      mapRef.current = map;

      // Přidání dlaždic OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Startovní a cílové body trasy
      const start = { lat: 50.0755, lng: 14.4378 }; // Praha
      const end = { lat: 49.1951, lng: 16.6068 }; // Brno

      // Naplánování a vykreslení trasy
      planRoute(start, end).then(route => {
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // GeoJSON souřadnice
        const polyline = L.polyline(coordinates, { color: 'blue' }).addTo(map); // Vykreslí trasu
        map.fitBounds(polyline.getBounds()); // Přizpůsobí mapu trase
      });
    }
  }, []);

  return <div id="mymap" style={{ height: '500px', width: '100%' }}></div>;
};

export default SeznamMap;
