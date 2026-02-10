'use client';

import { motion } from 'framer-motion';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const stations = [
    { id: '1', name: 'Shell Express', address: '123 Main St', regular: 1.45, premium: 1.65, distance: '0.3 km' },
    { id: '2', name: 'BP Highway', address: '456 Highway Rd', regular: 1.42, premium: 1.60, distance: '0.8 km' },
    { id: '3', name: 'Costco Gas', address: '321 Warehouse Blvd', regular: 1.35, premium: 1.52, distance: '2.5 km' },
];

const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function MapPage() {
    return (
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="space-y-6">
            <motion.div variants={anim}>
                <h1 className="text-2xl md:text-3xl font-bold">Fuel Map</h1>
                <p className="text-muted-foreground mt-1">Find nearby stations & compare prices</p>
            </motion.div>

            <motion.div variants={anim} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search fuel stations..." className="pl-10 h-11" />
                </div>
                <Button variant="outline" size="icon" className="h-11 w-11"><Navigation className="h-4 w-4" /></Button>
            </motion.div>

            <motion.div variants={anim}>
                <Card className="overflow-hidden">
                    <div className="relative h-[300px] md:h-[400px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 flex items-center justify-center">
                        <div className="text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-3">
                                <MapPin className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-lg font-semibold">Interactive Map</p>
                            <p className="text-sm text-muted-foreground mt-1">Add Mapbox token to enable</p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <motion.div variants={anim}>
                <h2 className="text-lg font-semibold mb-3">Nearby Stations</h2>
                <div className="space-y-3">
                    {stations.map((s) => (
                        <Card key={s.id} className="hover:shadow-md transition-all">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{s.name}</p>
                                            <p className="text-xs text-muted-foreground">{s.address} · {s.distance}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-center">
                                        <div className="rounded-lg bg-muted/50 px-2 py-1">
                                            <p className="text-[10px] text-muted-foreground">Regular</p>
                                            <p className="text-sm font-bold font-mono">${s.regular}</p>
                                        </div>
                                        <div className="rounded-lg bg-muted/50 px-2 py-1">
                                            <p className="text-[10px] text-muted-foreground">Premium</p>
                                            <p className="text-sm font-bold font-mono">${s.premium}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                                        <Navigation className="h-3.5 w-3.5" /> Directions
                                    </Button>
                                    <Button size="sm" className="flex-1">Log Fill-up</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
