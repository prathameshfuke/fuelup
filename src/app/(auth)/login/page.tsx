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
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Left side - Form */}
            <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 relative z-10 w-full lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo & Branding */}
                    <div className="text-center sm:text-left">
                        <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform duration-300">
                                <Gauge className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-foreground">
                                FuelUp
                            </span>
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">Welcome back</h1>
                            <p className="text-muted-foreground text-base">
                                Manage your fleet with precision and style.
                            </p>
                        </motion.div>
                    </div>

                    {/* Auth Card */}
                    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                        <div className="space-y-4 relative z-10">
                            {!isEmailMode ? (
                                <Button
                                    variant="outline"
                                    className="w-full h-12 gap-3 border-border hover:bg-secondary text-foreground transition-all"
                                    onClick={() => setIsEmailMode(true)}
                                >
                                    <Mail className="h-4 w-4" />
                                    Continue with Email
                                </Button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-foreground font-medium">Email address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="name@company.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-11 pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                        onClick={handleEmailSignIn}
                                        disabled={!email}
                                    >
                                        Send Login Link
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                    <button
                                        className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                                        onClick={() => setIsEmailMode(false)}
                                    >
                                        ← Back to other options
                                    </button>
                                </motion.div>
                            )}

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase bg-transparent">
                                    <span className="bg-card px-3 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleGuestSignIn}
                                variant="secondary"
                                className="w-full h-12 text-sm gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all font-medium"
                            >
                                <User className="h-4 w-4" />
                                Continue as Guest
                            </Button>
                        </div>
                    </div>

                    <p className="text-center sm:text-left text-xs text-muted-foreground mt-6 leading-relaxed">
                        By continuing, you agree to our{' '}
                        <Link href="#" className="text-foreground hover:underline underline-offset-4">Terms of Service</Link> and{' '}
                        <Link href="#" className="text-foreground hover:underline underline-offset-4">Privacy Policy</Link>.
                    </p>
                </div>
            </div>

            {/* Right side - Visual (desktop only) */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden bg-secondary items-center justify-center p-12 border-l border-border">
                {/* Ambient Particles Effect */}
                <Particles className="absolute inset-0 z-0" quantity={80} ease={80} color="#888888" refresh />

                {/* Subtle abstract background pattern for right side */}
                <div className="absolute inset-0 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--border)) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                <div className="relative z-10 max-w-lg w-full">
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { icon: BarChart3, title: 'Real-time Analytics', desc: 'Monitor fuel efficiency, track costs per distance, and spot trends over time.' },
                            { icon: Bell, title: 'Smart Reminders', desc: 'Never miss a maintenance service with automated alerts based on time or distance.' },
                            { icon: Lock, title: 'Secure Data', desc: 'Your fleet data is yours. Export it at any time or clear it completely with one click.' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                                className="p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground mb-1">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
