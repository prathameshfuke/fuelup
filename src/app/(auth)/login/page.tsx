'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ArrowRight, BarChart3, Bell, User, Lock, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/authStore';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { Particles } from '@/components/ui/particles';
import { GlowingStarsBackgroundCard } from '@/components/ui/glowing-stars-background-card';
import { BlurReveal } from '@/components/ui/blur-reveal';

export default function LoginPage() {
    const router = useRouter();
    const { theme } = useTheme();
    const { signInAsGuest } = useAuthStore();

    const handleGoogleSignIn = () => {
        // Supabase OAuth would go here
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
                                <img
                                    src={theme === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png'}
                                    alt="FuelUp"
                                    className="h-6 w-6 object-contain"
                                />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-foreground">
                                FuelUp
                            </span>
                        </Link>
                        <BlurReveal as="div">
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">Welcome back</h1>
                            <p className="text-muted-foreground text-base">
                                Manage your fleet with precision and style.
                            </p>
                        </BlurReveal>
                    </div>

                    {/* Auth Card */}
                    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                        <div className="space-y-4 relative z-10">
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
            <div className="hidden lg:flex flex-1 relative overflow-hidden bg-secondary items-center justify-center p-10 border-l border-border">
                {/* Ambient Particles Effect */}
                <Particles className="absolute inset-0 z-0" quantity={60} ease={80} refresh />

                <div className="relative z-10 w-full max-w-xl flex flex-col gap-5">
                    {/* Header label */}
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Why FuelUp?
                    </p>

                    {/* Feature Cards — uniform height, 3-column grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            {
                                icon: BarChart3,
                                title: 'Real-time Analytics',
                                desc: 'Monitor fuel efficiency, track costs per distance, and spot trends over time.',
                            },
                            {
                                icon: Bell,
                                title: 'Smart Reminders',
                                desc: 'Never miss a maintenance service with automated alerts based on time or distance.',
                            },
                            {
                                icon: Lock,
                                title: 'Secure Data',
                                desc: 'Your fleet data is yours. Export it at any time or clear it completely with one click.',
                            },
                        ].map(({ icon: Icon, title, desc }, i) => (
                            <GlowingStarsBackgroundCard key={title} className="p-5">
                                <div className="flex items-start gap-3.5">
                                    <div className="p-2.5 rounded-lg bg-secondary/80 border border-border/50 text-foreground shrink-0">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold text-foreground mb-1 leading-snug">{title}</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            </GlowingStarsBackgroundCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
