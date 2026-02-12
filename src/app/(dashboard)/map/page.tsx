'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Search, Fuel, Star, Map as MapIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BorderBeam } from '@/components/ui/border-beam';
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
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="max-w-7xl mx-auto space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <motion.div variants={anim} className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white">Fuel Map</h1>
                    <p className="text-neutral-400">Find nearby stations and compare prices</p>
                </div>
            </motion.div>

            <motion.div variants={anim} className="flex gap-2 shrink-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                        placeholder="Search fuel stations..."
                        className="pl-10 h-11 bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon" className="h-11 w-11 border-neutral-800 bg-neutral-900/50 text-white hover:bg-neutral-800">
                    <Navigation className="h-4 w-4" />
                </Button>
            </motion.div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Map */}
                <motion.div variants={anim} className="lg:col-span-2 h-full">
                    <GlassCard className="p-0 overflow-hidden h-full relative group">
                        <BorderBeam size={250} duration={12} delay={9} />
                        <div className="h-full w-full relative z-10 bg-neutral-900/50">
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
                                        style={{ height: '100%', width: '100%', background: '#171717' }}
                                        scrollWheelZoom={true}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                        />
                                    </MapContainer>
                                    <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-3xl" />
                                </>
                            )}
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Station List */}
                <motion.div variants={anim} className="h-full flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-3 shrink-0">
                        <h2 className="text-lg font-medium text-white">Nearby Stations</h2>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-neutral-400">{filteredStations.length} found</Badge>
                    </div>
                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {filteredStations.map((s, i) => (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <GlassCard
                                    className={`p-0 overflow-hidden cursor-pointer transition-all ${selectedStation === s.id ? 'bg-white/10 border-white/20' : 'hover:bg-white/5'
                                        }`}
                                    onClick={() => setSelectedStation(s.id === selectedStation ? null : s.id)}
                                >
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-neutral-800 flex items-center justify-center border border-neutral-700">
                                                    <Fuel className="h-5 w-5 text-neutral-400" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-white">{s.name}</p>
                                                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-yellow-950/30 border border-yellow-900/30">
                                                            <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
                                                            <span className="text-[10px] text-yellow-500 font-medium">{s.rating}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-neutral-500 mt-0.5">{s.address} · {s.distance}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-xs text-neutral-500">Regular</span>
                                                    <span className="text-lg font-mono text-white font-medium bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                                                        {formatCurrency(s.regular)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {selectedStation === s.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="flex gap-2 mt-4 pt-4 border-t border-white/5"
                                            >
                                                <Button
                                                    variant="outline" size="sm" className="flex-1 gap-1.5 border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`, '_blank');
                                                    }}
                                                >
                                                    <Navigation className="h-3.5 w-3.5" /> Directions
                                                </Button>
                                                <Button size="sm" className="flex-1 bg-white text-black hover:bg-neutral-200">Log Fill-up</Button>
                                            </motion.div>
                                        )}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
