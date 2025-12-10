import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

interface AdicionalUIProps {
  selectedOption: string | null;
  onCoordinatesSelect: (coords: string) => void;
}

// Map centers for known cities (same keys as CITY_COORDS in hook)
const CITY_CENTER: Record<string, { lat: number; lng: number; zoom?: number }> = {
  guayaquil: { lat: -2.1962, lng: -79.8862, zoom: 11 },
  quito: { lat: -0.2298, lng: -78.525, zoom: 11 },
  manta: { lat: -0.9494, lng: -80.7314, zoom: 11 },
  cuenca: { lat: -2.9005, lng: -79.0045, zoom: 11 },
};

export default function AdicionalUI({ selectedOption, onCoordinatesSelect }: AdicionalUIProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map once
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current, {
        center: [-2.1962, -79.8862],
        zoom: 11,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMapRef.current);

      // click handler to select coords
      // marcador amarillo personalizado
      const blueIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      leafletMapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const lat = (e.latlng.lat).toFixed(4);
        const lng = (e.latlng.lng).toFixed(4);
        // place or move blue marker
        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
        } else {
          markerRef.current = L.marker(e.latlng, { icon: blueIcon }).addTo(leafletMapRef.current as L.Map);
        }
        markerRef.current.setIcon(blueIcon);
        // send coords as string "lat,lng"
        onCoordinatesSelect(`${lat},${lng}`);
      });
    }

    // when selectedOption changes, recenter map
    let center;
    if (selectedOption && selectedOption.includes(',')) {
      // If selectedOption is coordinates string
      const [lat, lng] = selectedOption.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        center = { lat, lng, zoom: 13 };
      }
    } else {
      const key = selectedOption ? selectedOption.toLowerCase() : 'guayaquil';
      center = CITY_CENTER[key as keyof typeof CITY_CENTER] ?? CITY_CENTER['guayaquil'];
    }
    if (leafletMapRef.current && center) {
      leafletMapRef.current.setView([center.lat, center.lng], center.zoom ?? 11);
      // move marker to center as visual cue
      const latlng = L.latLng(center.lat, center.lng);
      if (markerRef.current) markerRef.current.setLatLng(latlng);
      else {
        // marcador amarillo para coordenadas personalizadas o ciudad
        const blueIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        markerRef.current = L.marker(latlng, { icon: blueIcon }).addTo(leafletMapRef.current);
      }
    }

    return () => {
      // do not remove map on unmount to avoid reinitialization problems in dev
    };
  }, [selectedOption, onCoordinatesSelect]);

  return (
    <div style={{ height: 350, width: '50%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
