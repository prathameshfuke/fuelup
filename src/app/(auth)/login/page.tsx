'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Gauge, Mail, ArrowRight, BarChart3, Bell, User, Lock, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { motion } from 'framer-motion';
import { Particles } from '@/components/ui/particles';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [isEmailMode, setIsEmailMode] = useState(false);
    const router = useRouter();
    const { signInAsGuest } = useAuthStore();

    const handleGoogleSignIn = () => {
        // Supabase OAuth would go here
        window.location.href = '/dashboard';
    };

    const handleEmailSignIn = () => {
        // Supabase email auth would go here
        window.location.href = '/dashboard';
    };

    const handleGuestSignIn = () => {
        signInAsGuest();
        router.push('/dashboard');
    };

    return (
        <div className="flex min-h-screen bg-neutral-950 text-white selection:bg-white/20 relative">
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
                <Particles
                    className="absolute inset-0"
                    quantity={40}
                    staticity={60}
                    ease={40}
                    size={0.6}
                    color="#ffffff"
                    refresh
                />
            </div>
            {/* Left side - Form */}
            <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 relative z-10">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo & Branding */}
                    <div className="text-center">
                        <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black shadow-lg shadow-white/10 group-hover:scale-105 transition-transform duration-500">
                                <Gauge className="h-7 w-7" />
                            </div>
                            <span className="text-3xl font-bold tracking-tighter text-white">
                                FuelUp
                            </span>
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl font-semibold tracking-tight text-white mb-2">Welcome back</h1>
                            <p className="text-neutral-400 text-lg">
                                Manage your fleet with precision and style.
                            </p>
                        </motion.div>
                    </div>

                    {/* Auth Glass Card */}
                    <GlassCard className="p-8 relative overflow-hidden group/card border-white/10">
                        <BorderBeam size={200} duration={8} delay={2} />

                        <div className="space-y-4">
                            {!isEmailMode ? (
                                <Button
                                    variant="ghost"
                                    className="w-full h-12 gap-3 border border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white transition-all bg-neutral-900/50"
                                    onClick={() => setIsEmailMode(true)}
                                >
                                    <Mail className="h-5 w-5" />
                                    Continue with Email
                                </Button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-neutral-300">Email address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="name@company.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-11 pl-10 bg-black/50 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/20 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full h-11 gap-2 bg-white text-black hover:bg-neutral-200 transition-colors"
                                        onClick={handleEmailSignIn}
                                        disabled={!email}
                                    >
                                        Send Login Link
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                    <button
                                        className="w-full text-xs text-neutral-500 hover:text-white transition-colors py-2"
                                        onClick={() => setIsEmailMode(false)}
                                    >
                                        ← Back to other options
                                    </button>
                                </motion.div>
                            )}

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase bg-transparent">
                                    <span className="bg-neutral-900/90 px-3 py-1 rounded-full border border-white/10 text-neutral-500">Guests</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleGuestSignIn}
                                variant="secondary"
                                className="w-full h-11 text-sm gap-2 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all"
                            >
                                <User className="h-4 w-4" />
                                Continue as Guest
                            </Button>
                        </div>
                    </GlassCard>

                    <p className="text-center text-xs text-neutral-600 mt-6">
                        By continuing, you agree to our{' '}
                        <Link href="#" className="text-white hover:underline decoration-neutral-600 underline-offset-4">Terms</Link> and{' '}
                        <Link href="#" className="text-white hover:underline decoration-neutral-600 underline-offset-4">Privacy Policy</Link>.
                    </p>
                </div>
            </div>

            {/* Right side - Visual (desktop only) */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden bg-black items-center justify-center p-12">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 via-black to-black opacity-50" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 max-w-lg">
                    <div className="grid grid-cols-1 gap-6">
                        {[
                            { icon: BarChart3, title: 'Real-time Analytics', desc: 'Monitor fuel efficiency and costs.' },
                            { icon: Bell, title: 'Smart Reminders', desc: 'Never miss a maintenance service.' },
                            { icon: Lock, title: 'Secure Data', desc: 'Your fleet data, encrypted and safe.' },
                        ].map((item, i) => (
                            <GlassCard key={i} className="p-6 flex items-start gap-4 hover:bg-white/5 transition-colors border-white/5">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-white">{item.title}</h3>
                                    <p className="text-neutral-400 leading-relaxed mt-1">{item.desc}</p>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
