"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Fuel, ShieldCheck, Zap, Car } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Particles } from '@/components/ui/particles';

const memoriaEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 relative flex items-center justify-center overflow-hidden rounded-lg border border-border group-hover:border-primary/50 transition-colors">
              <img src="/logo.png" alt="FuelUp" className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-medium tracking-tight text-foreground transition-colors duration-300">FuelUp</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/login">
              <Button className="h-9 px-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden z-10">
        <Particles className="absolute inset-0 z-0" quantity={120} staticity={30} color="#888888" refresh />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: memoriaEase, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground mb-8 text-[10px] font-semibold uppercase tracking-widest border border-border"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Introducing the new FuelUp Experience
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: memoriaEase, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 text-foreground max-w-4xl mx-auto leading-tight text-center"
          >
            Numbers are heroes. <br />
            <span className="text-muted-foreground font-light tracking-tight">Labels are whispers.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: memoriaEase, delay: 0.3 }}
            className="text-base md:text-lg tracking-wide text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            A premium platform to track fuel costs, monitor performance trends, and manage vehicles with absolute clarity. Built for modern drivers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: memoriaEase, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
          >
            <Link href="/login">
              <Button className="h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-base font-medium min-w-[160px]">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" className="h-12 px-8 rounded-full border-border text-foreground hover:bg-secondary transition-all text-base font-medium">
                Explore Features
              </Button>
            </Link>
          </motion.div>

          {/* Preview Image / Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: memoriaEase, delay: 0.5 }}
            className="w-full max-w-5xl mx-auto relative group"
          >
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-border/50 to-transparent blur-xl opacity-30 group-hover:opacity-70 transition duration-1000"></div>
            <div className="relative rounded-2xl border border-border bg-neutral-900/60 overflow-hidden shadow-2xl flex flex-col h-[400px] md:h-[600px] group-hover:border-neutral-700 transition-colors">
              {/* Mockup Header */}
              <div className="h-12 border-b border-border bg-background flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-border"></div>
                  <div className="w-3 h-3 rounded-full bg-border"></div>
                  <div className="w-3 h-3 rounded-full bg-border"></div>
                </div>
              </div>
              {/* Mockup Body - Simple grid representing UI */}
              <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 bg-card/50">
                <div className="md:col-span-2 space-y-6">
                  <div className="h-40 rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
                    <div className="w-32 h-4 rounded-full bg-muted-foreground/20"></div>
                    <div className="space-y-4">
                      <div className="w-1/2 h-8 rounded-full bg-foreground/10"></div>
                      <div className="w-full h-12 flex gap-2 items-end">
                        <div className="flex-1 rounded-t-sm bg-primary/20 h-1/3"></div>
                        <div className="flex-1 rounded-t-sm bg-primary/40 h-1/2"></div>
                        <div className="flex-1 rounded-t-sm bg-primary/60 h-3/4"></div>
                        <div className="flex-1 rounded-t-sm bg-primary h-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 rounded-xl bg-secondary/30 border border-border flex flex-col justify-center px-6 gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted-foreground/10"></div>
                      <div className="w-24 h-4 rounded-full bg-foreground/20"></div>
                    </div>
                    <div className="h-32 rounded-xl bg-secondary/30 border border-border flex flex-col justify-center px-6 gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted-foreground/10"></div>
                      <div className="w-24 h-4 rounded-full bg-foreground/20"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 hidden md:block">
                  <div className="h-24 rounded-xl bg-secondary/30 border border-border p-4 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-muted-foreground/10"></div>
                    <div className="space-y-2 flex-1">
                      <div className="w-full h-3 rounded-full bg-foreground/20"></div>
                      <div className="w-3/4 h-3 rounded-full bg-muted-foreground/20"></div>
                    </div>
                  </div>
                  <div className="h-24 rounded-xl bg-secondary/30 border border-border p-4 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-muted-foreground/10"></div>
                    <div className="space-y-2 flex-1">
                      <div className="w-full h-3 rounded-full bg-foreground/20"></div>
                      <div className="w-1/2 h-3 rounded-full bg-muted-foreground/20"></div>
                    </div>
                  </div>
                  <div className="h-24 rounded-xl bg-secondary/30 border border-border p-4 flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-muted-foreground/10"></div>
                    <div className="space-y-2 flex-1">
                      <div className="w-5/6 h-3 rounded-full bg-foreground/20"></div>
                      <div className="w-2/3 h-3 rounded-full bg-muted-foreground/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-4">Intelligent by design</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">Everything you need to effortlessly manage your vehicles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 flex flex-col min-h-[300px] border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 p-4 rounded-xl bg-secondary w-max text-muted-foreground">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">Fleet Management</h3>
              <p className="text-muted-foreground mb-auto text-sm leading-relaxed">Add multiple vehicles, track individual statistics, and visualize costs across your entire lineup.</p>
              <div className="pt-6">
                <AnimatedCounter value={150} className="text-4xl tracking-tighter text-foreground mb-1" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Logs Handled Daily</span>
              </div>
            </Card>

            <Card className="p-8 flex flex-col min-h-[300px] md:col-span-2 border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 p-4 rounded-xl bg-secondary w-max text-muted-foreground">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-medium text-foreground mb-4">Powerful Analytics</h3>
              <p className="text-muted-foreground max-w-lg text-sm leading-relaxed mb-auto">Visualize spending patterns, efficiency trends, and cost-per-mile metrics with clear, accurate charts dynamically updated.</p>

              <div className="mt-8 flex gap-4 h-20 w-3/4 opacity-50 pl-2">
                <div className="flex-1 rounded-t bg-primary/20 h-[30%] mt-auto"></div>
                <div className="flex-1 rounded-t bg-primary/40 h-[60%] mt-auto"></div>
                <div className="flex-1 rounded-t bg-primary/60 h-[45%] mt-auto"></div>
                <div className="flex-1 rounded-t bg-primary/80 h-[80%] mt-auto"></div>
                <div className="flex-1 rounded-t bg-primary h-[100%] mt-auto"></div>
              </div>
            </Card>

            <Card className="p-8 flex flex-col min-h-[240px] md:col-span-2 border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flexitems-center gap-6 mb-8 text-muted-foreground">
                <div className="flex gap-4">
                  <Fuel className="h-8 w-8" />
                  <Zap className="h-8 w-8" />
                  <ShieldCheck className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">Complete Toolset</h3>
              <p className="text-sm text-muted-foreground mb-4">From fill-ups to maintenance schedules, entirely unified in a single dashboard experience.</p>
            </Card>

            <Card className="p-8 flex flex-col min-h-[240px] border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6 p-4 rounded-xl bg-secondary w-max text-muted-foreground">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">Secure & Private</h3>
              <span className="text-sm text-muted-foreground">Your data stays yours. Encrypted and safe.</span>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10 bg-background border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-6">Drive with clarity.</h2>
          <p className="text-lg text-muted-foreground mb-10">Stop guessing about fuel economy and expenses. Start tracking properly today.</p>
          <Link href="/login">
            <Button className="h-14 px-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-lg font-medium shadow-lg">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-foreground">
            <div className="h-6 w-6 relative overflow-hidden rounded">
              <img src="/logo.png" alt="FuelUp" className="h-full w-full object-cover grayscale opacity-80" />
            </div>
            <span className="text-sm font-medium tracking-tight">FuelUp Platform</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FuelUp.
          </p>
        </div>
      </footer>
    </div>
  );
}
