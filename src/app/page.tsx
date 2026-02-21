"use client";

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { Wrapper3D } from '@/components/ui/wrapper-3d';
import { Meteors } from '@/components/ui/meteors';

import { Particles } from '@/components/ui/particles';
import { ArrowRight, BarChart3, Fuel, Smartphone, Wrench, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

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
          <div className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 relative flex items-center justify-center overflow-hidden rounded-lg border border-white/10 group-hover:border-white/20 transition-colors">
              <img src="/logo.png" alt="FuelUp" className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-heading font-medium tracking-tight text-white group-hover:text-[#00D9FF] transition-colors duration-300">FuelUp</span>
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

        {/* Meteors */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <Meteors number={15} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D9FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D9FF]"></span>
            </span>
            <span className="text-xs uppercase tracking-widest text-[#00D9FF] font-medium font-mono">v2.0 Performance Update</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-8xl font-heading font-bold tracking-tighter mb-8 text-white max-w-4xl mx-auto leading-[1.0] text-center"
          >
            Driven by Data.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#A855F7] filter drop-shadow-[0_0_10px_rgba(0,217,255,0.3)]">Defined by Precision.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <TextGenerateEffect
              words="The ultimate motorsport-grade vehicle telemetry platform. Track fuel, monitor efficiency, and make decisions with absolute numerical clarity."
              className="text-lg md:text-xl text-neutral-400 font-normal leading-relaxed text-center"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/login">
              <Button className="h-14 px-10 rounded-full bg-white text-black hover:bg-neutral-200 hover:scale-105 transition-all duration-300 text-lg font-bold min-w-[200px] shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Ignition
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="ghost" className="h-14 px-10 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-300 text-base font-medium">
                View Telemetry Specs
              </Button>
            </Link>
          </motion.div>

          {/* 3D Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full max-w-5xl mt-12 mx-auto"
          >
            <Wrapper3D className="w-full">
              <div className="relative w-full rounded-2xl border border-white/10 bg-[#0A0E1A]/80 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(0,217,255,0.15)] flex flex-col h-[400px] md:h-[500px]">
                {/* Mockup Header */}
                <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-black/40">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-neutral-600/50"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-600/50"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral-600/50"></div>
                  </div>
                  <div className="mx-auto flex items-center gap-2 bg-black/50 px-4 py-1.5 rounded-md border border-white/5 shadow-inner">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00FF88]" />
                    <span className="text-[11px] font-mono text-neutral-400 font-medium">fuelup.app/telemetry</span>
                  </div>
                </div>
                {/* Mockup Body */}
                <div className="p-6 md:p-8 flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/5 to-[#A855F7]/5 z-0" />

                  {/* Fake Sidebar */}
                  <div className="hidden md:flex flex-col gap-4 border-r border-white/5 pr-6 z-10 col-span-1">
                    <div className="h-8 rounded flex items-center px-3 mb-4">
                      <div className="h-8 w-8 rounded-full bg-white/10 mr-3"></div>
                      <div className="h-3 w-16 rounded bg-white/20"></div>
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-10 rounded-lg flex items-center px-3 ${i === 1 ? 'bg-white/5 border border-white/10' : 'bg-transparent'}`}>
                        <div className={`h-2.5 w-16 rounded ${i === 1 ? 'bg-[#00D9FF]' : 'bg-neutral-800'}`}></div>
                      </div>
                    ))}
                  </div>

                  {/* Fake Content Grid */}
                  <div className="col-span-1 md:col-span-3 flex flex-col gap-6 z-10 w-full h-full">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Metric Card 1 */}
                      <div className="h-28 flex-1 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-center px-6 shadow-lg shadow-black/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="h-4 w-4 text-[#00D9FF]" />
                          <div className="h-2 w-20 bg-neutral-600 rounded"></div>
                        </div>
                        <div className="h-8 w-32 bg-white rounded"></div>
                      </div>
                      {/* Metric Card 2 */}
                      <div className="h-28 flex-1 rounded-xl bg-gradient-to-br from-[#FF0039]/10 to-transparent border border-[#FF0039]/20 flex flex-col justify-center px-6 shadow-[0_0_20px_rgba(255,0,57,0.05)]">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 className="h-4 w-4 text-[#FF0039]" />
                          <div className="h-2 w-16 bg-[#FF0039]/50 rounded"></div>
                        </div>
                        <div className="h-8 w-24 bg-[#FF0039] rounded"></div>
                      </div>
                    </div>

                    {/* Fake Chart */}
                    <div className="flex-1 rounded-xl bg-black/40 border border-white/5 p-6 flex flex-col items-start gap-4 shadow-lg shadow-black/50">
                      <div className="h-2 w-24 bg-neutral-600 rounded mb-2"></div>
                      <div className="w-full flex-1 flex items-end justify-between gap-2 overflow-hidden">
                        {[40, 70, 45, 90, 65, 85, 50, 100, 60, 40].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#00D9FF]/20 to-[#00D9FF]/80 opacity-80" style={{ height: `${h}%` }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Wrapper3D>
          </motion.div>
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
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <div className="h-6 w-6 relative overflow-hidden rounded">
              <img src="/logo.png" alt="FuelUp" className="h-full w-full object-cover" />
            </div>
            <span className="text-sm font-medium text-white tracking-widest font-heading">FUELUP TELEMETRY</span>
          </div>
          <p className="text-xs text-neutral-600 uppercase tracking-wider">
            © {new Date().getFullYear()} FuelUp. Engineered for Drivers.
          </p>
        </div>
      </footer>
    </div>
  );
}
