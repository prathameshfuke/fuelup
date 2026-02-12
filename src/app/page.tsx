"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { ArrowRight, BarChart3, Fuel, Smartphone, Wrench } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-neutral-800 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-neutral-100 rounded-lg p-1">
              <img src="/logo.png" alt="FuelUp" className="h-6 w-6 object-contain mix-blend-multiply" />
            </div>
            <span className="text-lg font-medium tracking-tight">FuelUp</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/login">
              <Button variant="outline" className="h-9 px-4 rounded-full border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Spotlight Effect */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
            </span>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">v2.0 Now Available</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-8 text-white">
            Driven by Data.<br />
            <span className="text-neutral-500">Defined by You.</span>
          </h1>

          <div className="max-w-2xl mx-auto mb-12">
            <TextGenerateEffect
              words="The ultimate vehicle management platform. Track fuel, monitor efficiency, and make decisions with confident precision."
              className="text-lg md:text-xl text-neutral-400 font-normal"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button className="h-12 px-8 rounded-full bg-white text-black hover:bg-neutral-200 transition-all text-base font-medium">
                Start Tracking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <ProgressiveBlur direction="bottom" className="z-20 h-32" />
      </section>

      {/* Bento Grid Stats */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat 1 */}
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[240px]">
            <AnimatedCounter value={15000} className="text-6xl font-light tracking-tighter text-white mb-2" />
            <span className="text-xs uppercase tracking-widest text-neutral-500">Active Vehicles</span>
            <BorderBeam duration={12} delay={9} size={300} />
          </GlassCard>

          {/* Stat 2 */}
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[240px] md:col-span-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 z-0" />
            <div className="relative z-10">
              <h3 className="text-2xl font-light text-neutral-200 mb-4">Smart Analytics</h3>
              <p className="text-neutral-500 max-w-md mx-auto">Visualize spending patterns and efficiency trends with beautiful, zero-config charts.</p>
            </div>
            <BorderBeam duration={10} size={400} />
          </GlassCard>

          {/* Stat 3 */}
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[240px] md:col-span-1">
            <AnimatedCounter value={24} className="text-6xl font-light tracking-tighter text-white mb-2" />
            <span className="text-xs uppercase tracking-widest text-neutral-500">Hour Support</span>
          </GlassCard>

          {/* Stat 4 */}
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[240px] md:col-span-2">
            <div className="flex items-center gap-8 mb-6">
              <Fuel className="h-8 w-8 text-neutral-600" />
              <Wrench className="h-8 w-8 text-neutral-600" />
              <BarChart3 className="h-8 w-8 text-neutral-600" />
              <Smartphone className="h-8 w-8 text-neutral-600" />
            </div>
            <h3 className="text-xl font-light text-neutral-200">Complete Toolset</h3>
            <span className="text-xs uppercase tracking-widest text-neutral-500 mt-2">Everything you need</span>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-neutral-100 rounded p-0.5">
              <img src="/logo.png" alt="FuelUp" className="h-4 w-4 object-contain mix-blend-multiply" />
            </div>
            <span className="text-sm font-medium text-neutral-400">FuelUp System</span>
          </div>
          <p className="text-xs text-neutral-600 uppercase tracking-wider">
            © {new Date().getFullYear()} FuelUp. Engineered for Drivers.
          </p>
        </div>
      </footer>
    </div>
  );
}
