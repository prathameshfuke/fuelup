'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Search, Map as MapIcon, Fuel, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BorderBeam } from '@/components/ui/border-beam';
import { BlurReveal } from '@/components/ui/blur-reveal';
import dynamic from 'next/dynamic';
import { FuelStation } from '@/lib/api/places';
import { useSettingsStore } from '@/lib/store/settingsStore';

// Dynamically import MapComponent to disable SSR
const FuelMap = dynamic(
    () => import('@/components/map/FuelMap'),
    {
        loading: () => (
            <div className="h-full w-full flex items-center justify-center bg-background/50">
                <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin" />
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
    const { formatCurrency, distanceUnit, volumeUnit } = useSettingsStore();

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
                <BlurReveal as="div">
                    <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight text-foreground uppercase flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-sm shadow-sm" />
                        Fuel Map
                    </h1>
                    <p className="text-muted-foreground mt-2 font-mono text-sm tracking-widest uppercase">
                        Find nearby stations and compare prices
                    </p>
                </BlurReveal>

                {livePrice && (
                    <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 shadow-sm">
                        <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Live Petrol</p>
                                <p className="text-sm text-foreground font-bold">{formatCurrency(parseFloat(livePrice.petrol))}/{volumeUnit === 'liters' ? 'L' : 'G'}</p>
                            </div>
                            <div className="w-px bg-border my-1" />
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Live Diesel</p>
                                <p className="text-sm text-primary font-bold">{formatCurrency(parseFloat(livePrice.diesel))}/{volumeUnit === 'liters' ? 'L' : 'G'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            <motion.div variants={anim} className="flex gap-2 shrink-0 border border-border bg-card rounded-xl p-2 relative overflow-hidden shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search stations..."
                        className="pl-10 h-11 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 shadow-none font-medium text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:min-h-0">
                {/* Map */}
                <motion.div variants={anim} className="lg:col-span-2 h-[450px] lg:h-full z-0 order-start shrink-0">
                    <GlassCard className="p-0 overflow-hidden h-full relative group flex items-center justify-center border-border shadow-sm">
                        <div className="absolute inset-0 z-10 bg-muted/20">
                            <FuelMap onStationsFound={setStations} />
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Station List */}
                <motion.div variants={anim} className="h-[400px] lg:h-full flex flex-col lg:min-h-0 bg-card rounded-2xl border border-border overflow-hidden shadow-sm shrink-0">
                    <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-secondary/30">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-primary" />
                            Nearby Stations
                        </h2>
                        <Badge variant="secondary" className="font-medium bg-primary/10 text-primary hover:bg-primary/20">{filteredStations.length}</Badge>
                    </div>

                    {filteredStations.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-secondary/20">
                            <div className="h-12 w-12 rounded-xl bg-card border border-border flex items-center justify-center mb-4">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-sm font-medium">No stations found</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto custom-scrollbar flex-1 p-3 space-y-3 bg-secondary/10">
                            {filteredStations.map((s, i) => (
                                <motion.div
                                    key={s.id}
                                    initial={{ opacity: 0, filter: 'blur(5px)', x: -10 }}
                                    animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                >
                                    <GlassCard className="relative overflow-hidden group hover:border-border transition-colors z-10 w-full mb-3">
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden pointer-events-none z-0">
                                            <BorderBeam size={200} duration={8} delay={0} borderWidth={1.5} />
                                        </div>
                                        <div className="relative z-10 p-4 flex flex-col gap-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium text-foreground tracking-wide text-sm group-hover:text-primary transition-colors">{s.name}</h3>
                                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{s.distance?.toFixed(1)} {distanceUnit}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate mb-4">{s.address}</p>

                                            {livePrice && (
                                                <div className="mb-4 relative z-10 flex items-center gap-2 bg-secondary border border-border rounded-md p-2 w-fit">
                                                    <span className="text-xs font-medium text-muted-foreground">Est. Petrol</span>
                                                    <span className="text-sm font-bold text-success">{formatCurrency(getEstimatedPrice(s.brand)!)}/{volumeUnit === 'liters' ? 'L' : 'G'}</span>
                                                </div>
                                            )}

                                            <div className="flex gap-2 relative z-10">
                                                <a
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 border border-border hover:border-primary/50 hover:bg-primary/10 text-muted-foreground hover:text-primary text-xs font-medium py-2 rounded-lg text-center transition-all shadow-sm"
                                                >
                                                    Navigate
                                                </a>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
