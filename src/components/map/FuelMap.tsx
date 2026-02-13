'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FuelStation, fetchFuelStations } from '@/lib/api/places';
import { Button } from '@/components/ui/button';
import { Loader2, Navigation, MapPin } from 'lucide-react';
import { useTheme } from 'next-themes';
import { GlassCard } from '@/components/ui/glass-card';

// Fix for default Leaflet markers in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom Blue Pulsing Marker for User Location
const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `<div class="relative flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
           </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8] // Center it
});

// Fuel Station Icon
const stationIcon = L.divIcon({
    className: 'custom-station-marker',
    html: `<div class="flex items-center justify-center h-8 w-8 rounded-full bg-neutral-900 border-2 border-emerald-500 shadow-lg group hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M3 22v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M12 12V2"/><path d="M12 2a5 5 0 0 0-5 5v3"/><path d="M12 2a5 5 0 0 1 5 5v3"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

interface FuelMapProps {
    onStationsFound?: (stations: FuelStation[]) => void;
}

// Component to handle map center updates
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 14, { duration: 2 });
    }, [center, map]);
    return null;
}

type LocationStatus = 'idle' | 'locating' | 'success' | 'error' | 'denied';

const DEFAULT_LOCATION: [number, number] = [40.7128, -74.0060]; // New York

export default function FuelMap({ onStationsFound }: FuelMapProps) {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [stations, setStations] = useState<FuelStation[]>([]);
    const [status, setStatus] = useState<LocationStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { theme } = useTheme();

    const loadStations = async (lat: number, lon: number) => {
        const data = await fetchFuelStations(lat, lon);
        setStations(data);
        if (onStationsFound) onStationsFound(data);
    };

    const getIpLocation = async () => {
        try {
            console.log("Attempting IP Geolocation fallback...");
            const res = await fetch('https://ipapi.co/json/');
            if (!res.ok) throw new Error('IP Geolocation failed');
            const data = await res.json();
            if (data.latitude && data.longitude) {
                console.log("IP Location found:", data.latitude, data.longitude);
                setUserLocation([data.latitude, data.longitude]);
                loadStations(data.latitude, data.longitude);
                setStatus('success');
            } else {
                throw new Error('Invalid IP location data');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Could not detect location. Showing default map.");
            setUserLocation(DEFAULT_LOCATION);
            loadStations(DEFAULT_LOCATION[0], DEFAULT_LOCATION[1]);
            setStatus('error'); // Technically 'error' but showing default
        }
    };

    const startGeolocation = () => {
        console.log("Starting geolocation...");
        setStatus('locating');
        setErrorMessage('');

        if (!navigator.geolocation) {
            setErrorMessage("Geolocation is not supported by your browser.");
            getIpLocation();
            return;
        }

        const success = (position: GeolocationPosition) => {
            console.log("Geolocation success:", position.coords);
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            loadStations(latitude, longitude);
            setStatus('success');
        };

        const error = (err: GeolocationPositionError) => {
            console.warn(`Geolocation error (${err.code}): ${err.message}`);
            if (err.code === err.PERMISSION_DENIED) {
                setStatus('denied');
                // Don't auto-fallback on denied implies user choice, but for UX we might want to show default
                // Let's show default but with denied status so UI can prompt
                setUserLocation(DEFAULT_LOCATION);
                loadStations(DEFAULT_LOCATION[0], DEFAULT_LOCATION[1]);
            } else {
                // Timeout or unavailable -> Fallback to IP
                getIpLocation();
            }
        };

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(success, error, options);
    };

    // Initial load
    useEffect(() => {
        startGeolocation();
    }, []);

    // Determine tile layer based on theme
    const tileLayerUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

    if (status === 'locating' && !userLocation) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-neutral-900/50 rounded-3xl animate-pulse">
                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-neutral-400">Finding your location...</p>
                <p className="text-xs text-neutral-600 mt-2">Please allow location access if prompted</p>
            </div>
        );
    }

    // Default fallback view if still no location (rare case)
    const mapCenter = userLocation || DEFAULT_LOCATION;

    return (
        <div className="h-full w-full relative group">
            <MapContainer
                center={mapCenter}
                zoom={14}
                scrollWheelZoom={true}
                className="h-full w-full rounded-3xl z-0"
                style={{ background: '#0a0a0a' }}
            >
                <TileLayer
                    attribution={tileAttribution}
                    url={tileLayerUrl}
                />

                <MapUpdater center={mapCenter} />

                {/* User User Marker */}
                {userLocation && (
                    <Marker position={userLocation} icon={userIcon}>
                        <Popup className="custom-popup">
                            <div className="p-2">
                                <span className="font-semibold text-neutral-900">You are here</span>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Station Markers */}
                {stations.map((station) => (
                    <Marker
                        key={station.id}
                        position={[station.lat, station.lon]}
                        icon={stationIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-base mb-1">{station.name}</h3>
                                {station.address && <p className="text-xs text-neutral-500 mb-2 truncate">{station.address}</p>}
                                <div className="flex gap-2 mt-2">
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lon}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-3 rounded-md text-center font-medium transition-colors"
                                    >
                                        Directions
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Floating Controls */}
            <div className="absolute bottom-6 right-6 z-[400] flex flex-col gap-2">
                <Button
                    onClick={startGeolocation}
                    size="icon"
                    className={`h-12 w-12 rounded-full shadow-xl border border-neutral-800 text-white hover:bg-neutral-800 transition-all hover:scale-105 ${status === 'locating' ? 'bg-neutral-800' : 'bg-neutral-900'}`}
                >
                    {status === 'locating' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Navigation className="h-5 w-5" />}
                </Button>
            </div>

            {(status === 'denied' || status === 'error') && (
                <GlassCard className="absolute top-6 left-1/2 -translate-x-1/2 z-[400] px-4 py-3 rounded-full flex items-center gap-3 border-red-500/20 bg-red-950/20 backdrop-blur-md">
                    <div className="p-1 rounded-full bg-red-500/10">
                        <MapPin className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-red-200">Location issue</span>
                        <span className="text-xs text-red-400">{errorMessage || (status === 'denied' ? 'Access denied. Using default map.' : 'Error detecting location.')}</span>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={startGeolocation}
                        className="h-8 px-2 ml-2 text-red-300 hover:text-red-100 hover:bg-red-500/10"
                    >
                        Retry
                    </Button>
                </GlassCard>
            )}
        </div>
    );
}
