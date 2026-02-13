'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Search, Map as MapIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BorderBeam } from '@/components/ui/border-beam';
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

// Empty stations array for now, real implementation would fetch from API
const stations: any[] = [];

const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function MapPage() {
    const [searchQuery, setSearchQuery] = useState('');
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
                    <GlassCard className="p-0 overflow-hidden h-full relative group flex items-center justify-center bg-neutral-950">
                        <BorderBeam size={250} duration={12} delay={9} />
                        <div className="h-full w-full relative z-10 bg-neutral-900/50 flex flex-col items-center justify-center text-center p-6">
                            {mapReady && (
                                <>
                                    <link
                                        rel="stylesheet"
                                        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                                        crossOrigin=""
                                    />
                                    {/* Placeholder Map - In valid implementation this would render the map */}
                                    <div className="flex flex-col items-center gap-4 opacity-50">
                                        <div className="h-16 w-16 rounded-2xl bg-neutral-800 flex items-center justify-center">
                                            <MapIcon className="h-8 w-8 text-neutral-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-white">Map View Unavailable</h3>
                                            <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                                                Map integration requires a valid API key. This is a placeholder for the live map view.
                                            </p>
                                        </div>
                                    </div>
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

                    {filteredStations.length === 0 ? (
                        <GlassCard className="flex-1 flex flex-col items-center justify-center text-center p-6">
                            <div className="h-12 w-12 rounded-xl bg-neutral-900 flex items-center justify-center mb-3">
                                <Search className="h-6 w-6 text-neutral-600" />
                            </div>
                            <p className="text-neutral-400 font-medium">No stations found</p>
                            <p className="text-neutral-600 text-xs mt-1">Try searching for a different area or enable location services.</p>
                        </GlassCard>
                    ) : (
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {/* Empty as per request */}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
