"use client";

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

import { Particles } from '@/components/ui/particles';
import { ArrowRight, BarChart3, Fuel, Smartphone, Wrench, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-neutral-800 overflow-x-hidden">
      {/* Background Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Particles
          className="absolute inset-0"
          quantity={30}
          staticity={50}
          ease={50}
          size={0.4}
          color="#ffffff"
          refresh
        />
      </div>

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
      <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden z-10">
        {/* Spotlight Effect */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">v2.0 Now Available</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-light tracking-tight mb-8 text-white max-w-4xl mx-auto leading-[1.1]">
            Driven by Data.<br />
            <span className="text-neutral-500">Defined by You.</span>
          </h1>

          <div className="max-w-2xl mx-auto mb-12">
            <TextGenerateEffect
              words="The ultimate vehicle management platform. Track fuel, monitor efficiency, and make decisions with confident precision."
              className="text-lg md:text-xl text-neutral-400 font-normal leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/login">
              <Button className="h-12 px-8 rounded-full bg-white text-black hover:bg-neutral-200 transition-all text-base font-medium min-w-[160px]">
                Start Tracking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="ghost" className="h-12 px-8 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-all text-base font-medium">
                Learn More
              </Button>
            </Link>
          </div>

          {/* 3D Dashboard Preview */}
          {/* 3D Dashboard Preview Removed */}
        </div>

        <ProgressiveBlur direction="bottom" className="z-20 h-40 pointer-events-none" />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative z-10 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">Intelligent Features</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">Everything you need to manage your fleet, wrapped in a beautiful interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[300px] overflow-hidden group">
              <div className="mb-6 p-4 rounded-full bg-neutral-900/50 border border-neutral-800 group-hover:scale-110 transition-transform duration-500">
                <Zap className="h-8 w-8 text-neutral-400" />
              </div>
              <AnimatedCounter value={15000} className="text-5xl font-light tracking-tighter text-white mb-2" />
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">Active Vehicles</span>
              <BorderBeam duration={12} delay={9} size={300} />
            </GlassCard>

            {/* Stat 2 */}
            <GlassCard className="p-8 flex flex-col items-start justify-end text-left min-h-[300px] md:col-span-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 z-0" />
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                <BarChart3 className="h-40 w-40 text-white" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-light text-neutral-200 mb-2">Smart Analytics</h3>
                <p className="text-neutral-500 max-w-md text-sm leading-relaxed">Visualize spending patterns, efficiency trends, and cost-per-mile metrics with beautiful, zero-config charts powered by real-time data.</p>
              </div>
              <BorderBeam duration={10} size={400} />
            </GlassCard>

            {/* Stat 3 */}
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[240px] md:col-span-1">
              <div className="mb-6 p-4 rounded-full bg-neutral-900/50 border border-neutral-800 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="text-xl font-light text-white mb-1">Secure & Private</h3>
              <span className="text-xs text-neutral-500">Your data stays yours. Encrypted locally.</span>
            </GlassCard>

            {/* Stat 4 */}
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center min-h-[240px] md:col-span-2">
              <div className="flex items-center gap-8 mb-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <Fuel className="h-10 w-10 text-neutral-400" />
                <Wrench className="h-10 w-10 text-neutral-400" />
                <Globe className="h-10 w-10 text-neutral-400" />
                <Smartphone className="h-10 w-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-light text-neutral-200">Complete Toolset</h3>
              <span className="text-xs uppercase tracking-widest text-neutral-500 mt-2">Fuel • Maintenance • Trips • Maps</span>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-8">Ready to take control?</h2>
          <Link href="/login">
            <Button className="h-14 px-10 rounded-full bg-white text-black hover:bg-neutral-200 transition-all text-lg font-medium">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12 px-6 bg-neutral-950 relative z-10">
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
