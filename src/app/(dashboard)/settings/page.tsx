'use client';

import { motion } from 'framer-motion';
import { User, Car, Bell, Palette, Globe, Shield, LogOut, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const anim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function SettingsPage() {
    return (
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }} className="max-w-2xl mx-auto space-y-6">
            <motion.div variants={anim}>
                <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account & preferences</p>
            </motion.div>

            {/* Profile */}
            <motion.div variants={anim}>
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">U</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">FuelUp User</h3>
                                <p className="text-sm text-muted-foreground">user@example.com</p>
                                <Badge variant="secondary" className="mt-1">Free Plan</Badge>
                            </div>
                            <Button variant="outline" size="sm">Edit Profile</Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Preferences */}
            <motion.div variants={anim}>
                <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" /> Preferences</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Distance Unit</Label>
                            <Select defaultValue="km">
                                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="km">Kilometers</SelectItem>
                                    <SelectItem value="mi">Miles</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Volume Unit</Label>
                            <Select defaultValue="liters">
                                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="liters">Liters</SelectItem>
                                    <SelectItem value="gallons_us">US Gallons</SelectItem>
                                    <SelectItem value="gallons_uk">UK Gallons</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Currency</Label>
                            <Select defaultValue="usd">
                                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usd">USD ($)</SelectItem>
                                    <SelectItem value="eur">EUR (€)</SelectItem>
                                    <SelectItem value="gbp">GBP (£)</SelectItem>
                                    <SelectItem value="inr">INR (₹)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={anim}>
                <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { label: 'Maintenance Reminders', desc: 'Get notified before services are due', defaultOn: true },
                            { label: 'Price Drop Alerts', desc: 'Nearby fuel station price drops', defaultOn: true },
                            { label: 'Weekly Summary', desc: 'Weekly efficiency & cost report', defaultOn: false },
                            { label: 'Push Notifications', desc: 'Receive push notifications', defaultOn: true },
                        ].map((n, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">{n.label}</p>
                                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                                </div>
                                <Switch defaultChecked={n.defaultOn} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Data & Privacy */}
            <motion.div variants={anim}>
                <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Data & Privacy</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {['Export My Data', 'Privacy Settings', 'Delete Account'].map((label, i) => (
                            <button key={i} className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-accent transition-colors text-left">
                                <span className={`text-sm font-medium ${i === 2 ? 'text-destructive' : ''}`}>{label}</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </button>
                        ))}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Sign Out */}
            <motion.div variants={anim}>
                <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive">
                    <LogOut className="h-4 w-4" /> Sign Out
                </Button>
            </motion.div>

            <motion.div variants={anim} className="text-center pb-8">
                <p className="text-xs text-muted-foreground">FuelUp v1.0.0 · Made with ❤️</p>
            </motion.div>
        </motion.div>
    );
}
