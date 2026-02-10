'use client';

import Link from 'next/link';
import { Gauge, Chrome, Mail, ArrowRight, Fuel, BarChart3, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [isEmailMode, setIsEmailMode] = useState(false);

    const handleGoogleSignIn = () => {
        // Supabase OAuth would go here
        window.location.href = '/dashboard';
    };

    const handleEmailSignIn = () => {
        // Supabase email auth would go here
        window.location.href = '/dashboard';
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side - Form */}
            <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo & Branding */}
                    <div className="text-center">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                                <Gauge className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                FuelUp
                            </span>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                        <p className="mt-2 text-muted-foreground">
                            Sign in to manage your vehicles and track expenses
                        </p>
                    </div>

                    {/* Auth Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleGoogleSignIn}
                            variant="outline"
                            className="w-full h-12 text-base gap-3"
                            size="lg"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>

                        {!isEmailMode ? (
                            <Button
                                variant="outline"
                                className="w-full h-12 gap-3"
                                onClick={() => setIsEmailMode(true)}
                            >
                                <Mail className="h-5 w-5" />
                                Continue with Email
                            </Button>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 mt-1.5"
                                    />
                                </div>
                                <Button
                                    className="w-full h-12 gap-2"
                                    onClick={handleEmailSignIn}
                                    disabled={!email}
                                >
                                    Send Magic Link
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                                <button
                                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setIsEmailMode(false)}
                                >
                                    ← Back to options
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Value Props */}
                    <div className="grid grid-cols-3 gap-4 pt-6 text-center">
                        {[
                            { icon: Fuel, label: 'Track Efficiency' },
                            { icon: BarChart3, label: 'Save Money' },
                            { icon: Bell, label: 'Stay Maintained' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5">
                                <div className="rounded-full bg-primary/10 p-2">
                                    <item.icon className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-xs text-muted-foreground">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        By continuing, you agree to our{' '}
                        <Link href="#" className="text-primary hover:underline">Terms</Link> and{' '}
                        <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
                    </p>
                </div>
            </div>

            {/* Right side - Visual (desktop only) */}
            <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-md text-white text-center">
                    <div className="flex justify-center mb-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                            <Gauge className="h-9 w-9 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">
                        Your Vehicle. Your Data. Your Savings.
                    </h2>
                    <p className="text-white/80 text-lg mb-8">
                        Join drivers who save an average of $320/year by tracking their fuel expenses and optimizing their driving habits.
                    </p>
                    <div className="inline-flex flex-col gap-3 text-left bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-400" />
                            <span className="text-sm text-white/90">Multi-vehicle fleet management</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-400" />
                            <span className="text-sm text-white/90">AI-powered maintenance predictions</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-400" />
                            <span className="text-sm text-white/90">Tax-ready mileage reports</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-400" />
                            <span className="text-sm text-white/90">Works offline — syncs when online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
