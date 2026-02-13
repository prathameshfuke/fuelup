'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Search, Map as MapIcon, Fuel } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BorderBeam } from '@/components/ui/border-beam';
import dynamic from 'next/dynamic';
import { FuelStation } from '@/lib/api/places';

// Dynamically import MapComponent to disable SSR
const FuelMap = dynamic(
    () => import('@/components/map/FuelMap'),
    {
        loading: () => (
            <div className="h-full w-full flex items-center justify-center bg-neutral-950/50">
                <div className="h-8 w-8 rounded-full border-2 border-neutral-800 border-t-emerald-500 animate-spin" />
            </div>
        ),
        ssr: false
    }
);

const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function MapPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [stations, setStations] = useState<FuelStation[]>([]);

    const filteredStations = stations.filter(
        (s) => (s.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (s.address?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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
                        placeholder="Search loaded stations..."
                        className="pl-10 h-11 bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Map */}
                <motion.div variants={anim} className="lg:col-span-2 h-full z-0">
                    <GlassCard className="p-0 overflow-hidden h-full relative group flex items-center justify-center bg-neutral-950 border-neutral-800">
                        <BorderBeam size={250} duration={12} delay={9} />
                        <div className="absolute inset-0 z-10">
                            <FuelMap onStationsFound={setStations} />
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Station List */}
                <motion.div variants={anim} className="h-full flex flex-col min-h-0 bg-neutral-900/20 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0 bg-neutral-900/40">
                        <h2 className="text-lg font-medium text-white flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-emerald-500" />
                            Nearby Stations
                        </h2>
                        <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500">{filteredStations.length}</Badge>
                    </div>

                    {filteredStations.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                            <div className="h-12 w-12 rounded-xl bg-neutral-900 flex items-center justify-center mb-3">
                                <Search className="h-6 w-6 text-neutral-600" />
                            </div>
                            <p className="text-neutral-400 font-medium">No stations found</p>
                            <p className="text-neutral-600 text-xs mt-1">Try moving the map or checking location permissions.</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto custom-scrollbar flex-1 p-3 space-y-3">
                            {filteredStations.map((s, i) => (
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-3 rounded-xl bg-neutral-900/50 border border-white/5 hover:border-emerald-500/30 hover:bg-neutral-900/80 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">{s.name}</h3>
                                        <span className="text-xs font-mono text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded">{s.distance?.toFixed(1)} km</span>
                                    </div>
                                    <p className="text-xs text-neutral-500 truncate mb-3">{s.address || "Address not available"}</p>

                                    <div className="flex gap-2">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-white/5 hover:bg-white/10 text-neutral-300 text-[10px] uppercase tracking-wider font-semibold py-1.5 rounded text-center transition-colors"
                                        >
                                            Navigate
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
