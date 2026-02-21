'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Search, Map as MapIcon, Fuel, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BorderBeam } from '@/components/ui/border-beam';
import dynamic from 'next/dynamic';
import { FuelStation } from '@/lib/api/places';
import { useSettingsStore } from '@/lib/store/settingsStore';

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
    const [livePrice, setLivePrice] = useState<{ petrol: string, diesel: string } | null>(null);
    const { formatCurrency } = useSettingsStore();

    useEffect(() => {
        // Fetch live fuel prices
        const fetchPrices = async () => {
            try {
                // Fetching Mumbai prices as default generic live price
                const pRes = await fetch('/api/fuel-prices?city=mumbai&type=petrol');
                const dRes = await fetch('/api/fuel-prices?city=mumbai&type=diesel');
                if (pRes.ok && dRes.ok) {
                    const pData = await pRes.json();
                    const dData = await dRes.json();
                    setLivePrice({
                        petrol: pData.price.toString(),
                        diesel: dData.price.toString()
                    });
                }
            } catch (err) {
                console.error("Failed to fetch live prices", err);
            }
        };
        fetchPrices();
    }, []);

    const filteredStations = stations.filter(
        (s) => (s.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (s.address?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const getEstimatedPrice = (stationBrand: string | undefined) => {
        if (!livePrice) return null;
        const brand = (stationBrand || '').toLowerCase();
        const basePrice = parseFloat(livePrice.petrol);

        if (brand.includes('shell')) return basePrice + 11.5;
        if (brand.includes('nayara') || brand.includes('essar')) return basePrice + 1.2;
        if (brand.includes('reliance') || brand.includes('jio')) return basePrice + 1.5;
        if (brand.includes('indian oil') || brand.includes('bharat petroleum') || brand.includes('hp') || brand.includes('hindustan petroleum')) return basePrice;

        // Random slight variation for generic stations based on ID hash
        return basePrice;
    };

    return (
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="max-w-7xl mx-auto space-y-6 flex flex-col lg:h-[calc(100vh-40px)] pb-24 md:pb-6">
            <motion.div variants={anim} className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-white uppercase flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#00D9FF] rounded-full shadow-[0_0_10px_rgba(0,217,255,0.8)]" />
                        Fuel Map
                    </h1>
                    <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest mt-2 ml-4">Find nearby stations and compare prices</p>
                </div>

                {livePrice && (
                    <div className="flex items-center gap-3 bg-[#0A0E1A]/40 border border-white/5 rounded-xl p-3 backdrop-blur-sm">
                        <div className="p-2 rounded-lg bg-[#FF0039]/10 border border-[#FF0039]/20 shadow-[0_0_10px_rgba(255,0,57,0.2)]">
                            <TrendingUp className="h-5 w-5 text-[#FF0039]" />
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-tight">Live Petrol</p>
                                <p className="font-mono text-white font-bold">{formatCurrency(parseFloat(livePrice.petrol))}/L</p>
                            </div>
                            <div className="w-px bg-white/10" />
                            <div>
                                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-tight">Live Diesel</p>
                                <p className="font-mono text-[#00D9FF] font-bold">{formatCurrency(parseFloat(livePrice.diesel))}/L</p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            <motion.div variants={anim} className="flex gap-2 shrink-0 border border-white/5 bg-[#0A0E1A]/40 rounded-xl p-2 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00D9FF]/50" />
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                        placeholder="SEARCH LOADED STATIONS..."
                        className="pl-10 h-11 bg-transparent border-none text-white placeholder:text-neutral-600 focus-visible:ring-0 shadow-none font-mono text-sm tracking-wider uppercase"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:min-h-0">
                {/* Map */}
                <motion.div variants={anim} className="lg:col-span-2 h-[450px] lg:h-full z-0 order-start shrink-0">
                    <GlassCard className="p-0 overflow-hidden h-full relative group flex items-center justify-center bg-[#0A0E1A]/60 border-white/5">
                        <BorderBeam size={250} duration={12} delay={9} />
                        <div className="absolute inset-0 z-10">
                            <FuelMap onStationsFound={setStations} />
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Station List */}
                <motion.div variants={anim} className="h-[400px] lg:h-full flex flex-col lg:min-h-0 bg-[#0A0E1A]/40 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm shrink-0">
                    <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0 bg-[#0A0E1A]/80">
                        <h2 className="text-sm font-heading font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-[#00D9FF]" />
                            Nearby Stations
                        </h2>
                        <Badge variant="outline" className="bg-[#00D9FF]/10 border-[#00D9FF]/30 text-[#00D9FF] font-mono">{filteredStations.length}</Badge>
                    </div>

                    {filteredStations.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#0A0E1A]/20">
                            <div className="h-12 w-12 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center mb-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                                <Search className="h-5 w-5 text-neutral-600" />
                            </div>
                            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">No stations found</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto custom-scrollbar flex-1 p-3 space-y-3 bg-[#0A0E1A]/20">
                            {filteredStations.map((s, i) => (
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-4 rounded-xl border border-white/5 bg-neutral-900/50 hover:bg-[#00D9FF]/5 hover:border-[#00D9FF]/30 transition-all cursor-pointer group relative overflow-hidden backdrop-blur-sm"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00D9FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <h3 className="font-bold text-white uppercase tracking-wider text-sm group-hover:text-[#00D9FF] transition-colors">{s.name}</h3>
                                        <span className="text-[10px] font-mono text-[#00D9FF] bg-[#00D9FF]/10 border border-[#00D9FF]/20 px-1.5 py-0.5 rounded uppercase tracking-widest">{s.distance?.toFixed(1)} km</span>
                                    </div>
                                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest truncate mb-3 relative z-10">{s.address}</p>

                                    {livePrice && (
                                        <div className="mb-4 relative z-10 flex items-center gap-2 bg-[#0A0E1A]/80 border border-white/5 rounded-md p-1.5 w-fit">
                                            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Est. Petrol</span>
                                            <span className="text-[11px] font-mono font-bold text-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.2)]">{formatCurrency(getEstimatedPrice(s.brand)!)}/L</span>
                                        </div>
                                    )}

                                    <div className="flex gap-2 relative z-10">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 border border-white/10 hover:border-[#00D9FF]/50 hover:bg-[#00D9FF]/10 text-neutral-300 hover:text-[#00D9FF] text-[10px] uppercase tracking-widest font-mono font-bold py-2 rounded-lg text-center transition-all"
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
