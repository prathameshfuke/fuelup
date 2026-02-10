'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Search, Fuel, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSettingsStore } from '@/lib/store/settingsStore';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const MarkerComponent = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const PopupComponent = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

const stations = [
    { id: '1', name: 'Shell Express', address: '123 Main St', regular: 1.45, premium: 1.65, distance: '0.3 km', lat: 19.076, lng: 72.8777, rating: 4.5 },
    { id: '2', name: 'BP Highway', address: '456 Highway Rd', regular: 1.42, premium: 1.60, distance: '0.8 km', lat: 19.082, lng: 72.871, rating: 4.2 },
    { id: '3', name: 'Indian Oil', address: '789 Station Rd', regular: 1.38, premium: 1.55, distance: '1.2 km', lat: 19.070, lng: 72.885, rating: 4.0 },
    { id: '4', name: 'HP Petrol Pump', address: '321 Fuel Lane', regular: 1.40, premium: 1.58, distance: '1.8 km', lat: 19.065, lng: 72.873, rating: 4.3 },
    { id: '5', name: 'Costco Gas', address: '654 Warehouse Blvd', regular: 1.35, premium: 1.52, distance: '2.5 km', lat: 19.090, lng: 72.865, rating: 4.7 },
];

const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function MapPage() {
    const { formatCurrency } = useSettingsStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStation, setSelectedStation] = useState<string | null>(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        setMapReady(true);
    }, []);

    const filteredStations = stations.filter(
        (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
            <motion.div variants={anim}>
                <h1 className="text-2xl md:text-3xl font-bold">Fuel Map</h1>
                <p className="text-muted-foreground mt-1">Find nearby stations and compare prices</p>
            </motion.div>

            <motion.div variants={anim} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search fuel stations..."
                        className="pl-10 h-11"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon" className="h-11 w-11">
                    <Navigation className="h-4 w-4" />
                </Button>
            </motion.div>

            {/* Map */}
            <motion.div variants={anim}>
                <Card className="overflow-hidden">
                    <div className="h-[300px] md:h-[400px] relative">
                        {mapReady && (
                            <>
                                <link
                                    rel="stylesheet"
                                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                                    crossOrigin=""
                                />
                                <MapContainer
                                    center={[19.076, 72.8777]}
                                    zoom={14}
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={true}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                </MapContainer>
                            </>
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* Station List */}
            <motion.div variants={anim}>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Nearby Stations</h2>
                    <Badge variant="secondary">{filteredStations.length} found</Badge>
                </div>
                <div className="space-y-3">
                    {filteredStations.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card
                                className={`hover:shadow-md transition-all cursor-pointer ${selectedStation === s.id ? 'ring-2 ring-primary' : ''
                                    }`}
                                onClick={() => setSelectedStation(s.id === selectedStation ? null : s.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                                                <Fuel className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{s.name}</p>
                                                    <div className="flex items-center gap-0.5">
                                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                        <span className="text-xs text-muted-foreground">{s.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{s.address} · {s.distance}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-center">
                                            <div className="rounded-lg bg-green-500/10 px-2.5 py-1.5">
                                                <p className="text-[10px] text-muted-foreground">Regular</p>
                                                <p className="text-sm font-bold font-mono text-green-500">{formatCurrency(s.regular)}</p>
                                            </div>
                                            <div className="rounded-lg bg-amber-500/10 px-2.5 py-1.5">
                                                <p className="text-[10px] text-muted-foreground">Premium</p>
                                                <p className="text-sm font-bold font-mono text-amber-500">{formatCurrency(s.premium)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {selectedStation === s.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="flex gap-2 mt-3 pt-3 border-t"
                                        >
                                            <Button
                                                variant="outline" size="sm" className="flex-1 gap-1.5"
                                                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`, '_blank')}
                                            >
                                                <Navigation className="h-3.5 w-3.5" /> Directions
                                            </Button>
                                            <Button size="sm" className="flex-1">Log Fill-up</Button>
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
