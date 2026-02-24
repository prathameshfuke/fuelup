"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation, MapPin } from "lucide-react";
import { useTheme } from "next-themes";
import { useSettingsStore, CURRENCY_CONFIG } from "@/lib/store/settingsStore";

// Fix Leaflet marker icon issue in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const customIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface FuelStation {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    brand?: string;
    currentPrices?: {
        regular?: number;
        premium?: number;
        diesel?: number;
    };
    distance?: number;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 14);
    }, [center, map]);
    return null;
}

export default function FuelStationMap() {
    const { theme } = useTheme();
    const { currency } = useSettingsStore();
    const currencySymbol = CURRENCY_CONFIG[currency].symbol;
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [stations, setStations] = useState<FuelStation[]>([]);
    const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);

    // Get user location and fetch stations
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                await fetchNearbyStations(latitude, longitude);
            },
            (error) => console.error("Location error:", error),
            { enableHighAccuracy: true }
        );
    }, []);

    const fetchNearbyStations = async (lat: number, lng: number) => {
        try {
            const response = await fetch("/api/fuel-stations/nearby", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latitude: lat, longitude: lng, radius: 5000 }),
            });
            const data = await response.json();
            setStations(data.stations || []);
        } catch (error) {
            console.error("Failed to fetch stations:", error);
        }
    };

    if (!userLocation) {
        return (
            <div className="flex h-[600px] w-full items-center justify-center rounded-xl border bg-muted/20 shadow-xl">
                <p className="text-muted-foreground">Locating you...</p>
            </div>
        );
    }

    // Dark mode tile layer (CartoDB Dark Matter) vs Light mode (OpenStreetMap)
    const tileLayerUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = theme === 'dark'
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    return (
        <div className="relative h-[600px] w-full overflow-hidden rounded-xl border shadow-xl">
            <MapContainer
                center={userLocation}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
            >
                <TileLayer
                    attribution={attribution}
                    url={tileLayerUrl}
                />
                <MapUpdater center={userLocation} />

                {/* User Location Marker */}
                <Marker position={userLocation} icon={customIcon}>
                    <Popup>You are here</Popup>
                </Marker>

                {/* Station Markers */}
                {stations.map((station) => (
                    <Marker
                        key={station.id}
                        position={[station.latitude, station.longitude]}
                        icon={customIcon}
                        eventHandlers={{
                            click: () => setSelectedStation(station),
                        }}
                    />
                ))}
            </MapContainer>

            {/* Station Detail Card */}
            {selectedStation && (
                <Card className="absolute bottom-4 left-4 right-4 z-[1000] p-4 shadow-xl md:right-auto md:w-96 animate-in slide-in-from-bottom-5 duration-300">
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold">{selectedStation.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {selectedStation.address}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedStation(null)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                ×
                            </button>
                        </div>

                        {selectedStation.currentPrices && (
                            <div className="grid grid-cols-3 gap-2">
                                <div className="rounded-lg bg-secondary p-2 text-center">
                                    <div className="text-xs text-muted-foreground">Regular</div>
                                    <div className="font-bold">
                                        {selectedStation.currentPrices.regular != null ? `${currencySymbol}${selectedStation.currentPrices.regular.toFixed(2)}` : "—"}
                                    </div>
                                </div>
                                <div className="rounded-lg bg-secondary p-2 text-center">
                                    <div className="text-xs text-muted-foreground">Premium</div>
                                    <div className="font-bold">
                                        {selectedStation.currentPrices.premium != null ? `${currencySymbol}${selectedStation.currentPrices.premium.toFixed(2)}` : "—"}
                                    </div>
                                </div>
                                <div className="rounded-lg bg-secondary p-2 text-center">
                                    <div className="text-xs text-muted-foreground">Diesel</div>
                                    <div className="font-bold">
                                        {selectedStation.currentPrices.diesel != null ? `${currencySymbol}${selectedStation.currentPrices.diesel.toFixed(2)}` : "—"}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button className="flex-1" variant="outline">
                                <Navigation className="mr-2 h-4 w-4" />
                                Directions
                            </Button>
                            <Button className="flex-1">
                                <MapPin className="mr-2 h-4 w-4" />
                                Log Fill-Up
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
