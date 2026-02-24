"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, BarChart3, Fuel, ShieldCheck, Zap, Car, CheckCircle2 } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { MEMORIA_EASING } from '@/lib/animations/easing';
import { MorphLoader } from '@/components/ui/morph-loader';
import { useTheme } from 'next-themes';

const ease = [...MEMORIA_EASING.smooth] as [number, number, number, number];

// ── Reusable word-by-word reveal ──────────────────────────────
function WordReveal({
  text,
  className,
  startDelay = 0,
  color = 'foreground',
}: {
  text: string;
  className?: string;
  startDelay?: number;
  color?: 'foreground' | 'muted';
}) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: '0.28em' }}
          initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: startDelay + i * 0.1, duration: 0.55, ease }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ── Ambient floating orbs ──────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden>
      <div
        className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.055) 0%, transparent 70%)',
          animation: 'float-orb-a 14s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-1/3 -right-20 w-[420px] h-[420px] rounded-full blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
          animation: 'float-orb-b 18s ease-in-out infinite',
          animationDelay: '4s',
        }}
      />
      <div
        className="absolute bottom-10 left-1/4 w-[380px] h-[380px] rounded-full blur-[90px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.045) 0%, transparent 70%)',
          animation: 'float-orb-c 11s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />
    </div>
  );
}

// ── Stats strip data ───────────────────────────────────────────
const STATS = [
  { value: 12000, suffix: '+', label: 'Drivers Tracked', prefix: '' },
  { value: 50,    suffix: 'M+', label: 'Cost Monitored',  prefix: '₹' },
  { value: 99.9,  suffix: '%',  label: 'Platform Uptime', prefix: '' },
  { value: 80,    suffix: '+',  label: 'Cities Active',   prefix: '' },
];

// ── Trust pills ────────────────────────────────────────────────
const TRUST = ['No credit card', 'Free tier included', 'End-to-end encrypted'];

// ── Feature cards data ────────────────────────────────────────
const FEATURES = [
  {
    icon: Car,
    title: 'Fleet Management',
    desc: 'Add multiple vehicles, track individual statistics, and visualize costs across your entire lineup.',
    stat: 150,
    statLabel: 'Logs Handled Daily',
    span: 1,
  },
  {
    icon: BarChart3,
    title: 'Powerful Analytics',
    desc: 'Visualize spending patterns, efficiency trends, and cost-per-mile metrics with clear, accurate charts dynamically updated.',
    stat: null,
    statLabel: null,
    span: 2,
  },
];

// ── Card stagger variants ─────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)' },
};

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png';

  return (
    <>
      {/* ── Intro morph loader (once per session) ── */}
      <MorphLoader />

      {/* ── Scroll progress line ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-foreground/50 origin-left z-[60] pointer-events-none"
        style={{ scaleX }}
      />

      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden font-sans">

        {/* ════════════════════════════════════════════
            NAV
        ════════════════════════════════════════════ */}
        <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 relative flex items-center justify-center overflow-hidden rounded-lg border border-border group-hover:border-primary/50 transition-colors">
                <img src={logoSrc} alt="FuelUp" className="h-full w-full object-contain" />
              </div>
              <span className="text-xl font-medium tracking-tight text-foreground transition-colors duration-300">FuelUp</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
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

        {/* ════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════ */}
        <section className="relative pt-32 pb-20 px-6 min-h-[92vh] flex flex-col items-center justify-center text-center overflow-hidden z-10">
          {/* Contained radial hero glow — no canvas needed */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--foreground) / 0.04) 0%, transparent 70%)',
            }}
          />

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }}
          />

          {/* Ambient orbs */}
          <FloatingOrbs />

          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">

            {/* ── Live badge ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 text-secondary-foreground mb-8 text-[10px] font-semibold uppercase tracking-widest border border-border backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Introducing the new FuelUp Experience
            </motion.div>

            {/* ── Headline — word-by-word ── */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight max-w-4xl mx-auto leading-tight text-center mb-6">
              <span className="block text-foreground">
                <WordReveal text="Numbers are heroes." startDelay={0.25} />
              </span>
              <span className="block text-muted-foreground font-light">
                <WordReveal text="Labels are whispers." startDelay={0.65} />
              </span>
            </h1>

            {/* ── Subtext ── */}
            <motion.p
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease, delay: 1.0 }}
              className="text-base md:text-lg tracking-wide text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal mb-10"
            >
              A premium platform to track fuel costs, monitor performance trends, and manage vehicles with absolute clarity. Built for modern drivers.
            </motion.p>

            {/* ── CTA ── */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease, delay: 1.15 }}
              className="flex flex-col items-center gap-6 mb-24"
            >
              <Link href="/login">
                <Button className="relative h-12 px-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-base font-medium min-w-[200px] overflow-hidden group/cta animate-glow-pulse">
                  {/* Shimmer sweep */}
                  <motion.span
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                    initial={{ x: '-110%' }}
                    animate={{ x: '220%' }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: 'linear', repeatDelay: 1.8 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Free
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </span>
                </Button>
              </Link>

              {/* Trust micro-strip */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                {TRUST.map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 + i * 0.1 }}
                    className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground/60" />
                    {t}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Mockup preview ── */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease, delay: 1.25 }}
              className="w-full max-w-5xl mx-auto relative group"
            >
              {/* Outer glow ring */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-lg opacity-60 group-hover:opacity-100 transition duration-700" />
              {/* Glow halo */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-radial from-white/5 to-transparent blur-2xl opacity-0 group-hover:opacity-60 transition duration-1000 pointer-events-none" />

              <div className="relative rounded-2xl border border-border bg-neutral-900/60 overflow-hidden shadow-2xl flex flex-col h-[360px] md:h-[560px] group-hover:border-neutral-700 transition-colors">
                {/* Window chrome */}
                <div className="h-11 border-b border-border bg-background flex items-center px-4 gap-2 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-border" />
                    <div className="w-3 h-3 rounded-full bg-border" />
                    <div className="w-3 h-3 rounded-full bg-border" />
                  </div>
                  {/* Fake URL bar */}
                  <div className="mx-auto h-5 w-48 rounded-md bg-secondary/50 border border-border/50" />
                </div>

                {/* Mockup body */}
                <div className="p-6 md:p-8 flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 bg-card/50 relative overflow-hidden">
                  {/* Animated scan line */}
                  <motion.div
                    className="absolute inset-x-6 md:inset-x-8 h-[1px] pointer-events-none z-20"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                    }}
                    animate={{ top: ['8%', '90%'] }}
                    transition={{ duration: 4.5, ease: 'linear', repeat: Infinity, repeatDelay: 3 }}
                  />

                  <div className="md:col-span-2 space-y-5">
                    <div className="h-36 rounded-xl bg-secondary/30 border border-border p-5 flex flex-col justify-between">
                      <div className="w-28 h-3 rounded-full bg-muted-foreground/20" />
                      <div className="space-y-3">
                        <div className="w-1/2 h-7 rounded-full bg-foreground/10" />
                        <div className="w-full h-10 flex gap-1.5 items-end">
                          {[0.3, 0.55, 0.42, 0.78, 0.6, 1, 0.85].map((h, i) => (
                            <motion.div
                              key={i}
                              className="flex-1 rounded-t-sm bg-primary/50"
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ delay: 1.5 + i * 0.07, duration: 0.4, ease: 'backOut' }}
                              style={{ height: `${h * 100}%`, transformOrigin: 'bottom' }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      {[0, 1].map(j => (
                        <div key={j} className="h-28 rounded-xl bg-secondary/30 border border-border flex flex-col justify-center px-5 gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-muted-foreground/10" />
                          <div className="w-20 h-3 rounded-full bg-foreground/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 hidden md:block">
                    {[1, 0.75, 0.5].map((w, k) => (
                      <div key={k} className="h-24 rounded-xl bg-secondary/30 border border-border p-4 flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-xl bg-muted-foreground/10 shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="h-2.5 rounded-full bg-foreground/20" style={{ width: `${w * 100}%` }} />
                          <div className="h-2.5 rounded-full bg-muted-foreground/15" style={{ width: `${w * 65}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            STATS STRIP
        ════════════════════════════════════════════ */}
        <section className="py-10 border-y border-border/40 bg-secondary/10 relative">
          {/* Subtle background noise lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--foreground)) 0px, hsl(var(--foreground)) 1px, transparent 1px, transparent 80px)',
            }}
          />
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.55, ease }}
                  className="text-center py-3"
                >
                  <div className="text-3xl md:text-4xl font-light text-foreground tracking-tight mb-1.5 font-heading tabular-nums">
                    {stat.prefix}
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix}
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.18em]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FEATURES
        ════════════════════════════════════════════ */}
        <section id="features" className="py-24 px-6 bg-secondary/20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.7, ease }}
                className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-4"
              >
                Intelligent by design
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.1 }}
                className="text-muted-foreground max-w-xl mx-auto text-base"
              >
                Everything you need to effortlessly manage your vehicles.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fleet management */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.7, ease, delay: 0 }}
              >
                <Card className="p-8 flex flex-col min-h-[300px] border border-border/50 bg-card shadow-sm hover:shadow-md hover:border-border transition-all duration-300 h-full">
                  <div className="mb-6 p-4 rounded-xl bg-secondary w-max text-muted-foreground">
                    <Car className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-2">Fleet Management</h3>
                  <p className="text-muted-foreground mb-auto text-sm leading-relaxed">
                    Add multiple vehicles, track individual statistics, and visualize costs across your entire lineup.
                  </p>
                  <div className="pt-6">
                    <AnimatedCounter value={150} className="text-4xl tracking-tighter text-foreground mb-1" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Logs Handled Daily</span>
                  </div>
                </Card>
              </motion.div>

              {/* Analytics — wider */}
              <motion.div
                className="md:col-span-2"
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.12 }}
              >
                <Card className="p-8 flex flex-col min-h-[300px] border border-border/50 bg-card shadow-sm hover:shadow-md hover:border-border transition-all duration-300 h-full">
                  <div className="mb-6 p-4 rounded-xl bg-secondary w-max text-muted-foreground">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-medium text-foreground mb-4">Powerful Analytics</h3>
                  <p className="text-muted-foreground max-w-lg text-sm leading-relaxed mb-auto">
                    Visualize spending patterns, efficiency trends, and cost-per-mile metrics with clear, accurate charts dynamically updated.
                  </p>
                  {/* Animated bar chart illustration */}
                  <div className="mt-8 flex gap-3 h-20 w-3/4 pl-2 items-end">
                    {[0.3, 0.6, 0.45, 0.8, 1].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-t bg-primary/40"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, amount: 0 }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: 'backOut' }}
                        whileHover={{ backgroundColor: 'hsl(var(--primary) / 0.7)' }}
                        style={{ height: `${h * 100}%`, transformOrigin: 'bottom' }}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Complete Toolset — wider */}
              <motion.div
                className="md:col-span-2"
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.08 }}
              >
                <Card className="p-8 flex flex-col min-h-[240px] border border-border/50 bg-card shadow-sm hover:shadow-md hover:border-border transition-all duration-300 h-full">
                  <div className="flex gap-4 mb-8 text-muted-foreground">
                    {[Fuel, Zap, ShieldCheck].map((Icon, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.15, color: 'hsl(var(--foreground))' }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <Icon className="h-8 w-8" />
                      </motion.div>
                    ))}
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-2">Complete Toolset</h3>
                  <p className="text-sm text-muted-foreground">
                    From fill-ups to maintenance schedules, entirely unified in a single dashboard experience.
                  </p>
                </Card>
              </motion.div>

              {/* Secure */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.2 }}
              >
                <Card className="p-8 flex flex-col min-h-[240px] border border-border/50 bg-card shadow-sm hover:shadow-md hover:border-border transition-all duration-300 h-full">
                  <div className="mb-6 p-4 rounded-xl bg-secondary w-max text-muted-foreground">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-2">Secure & Private</h3>
                  <p className="text-sm text-muted-foreground">Your data stays yours. Encrypted and safe at rest and in transit.</p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CTA
        ════════════════════════════════════════════ */}
        <section className="py-28 px-6 relative z-10 bg-background border-y border-border overflow-hidden">
          {/* Animated radial glow behind CTA */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                'radial-gradient(ellipse 60% 40% at 50% 120%, rgba(255,255,255,0.04) 0%, transparent 70%)',
                'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,255,255,0.07) 0%, transparent 70%)',
                'radial-gradient(ellipse 60% 40% at 50% 120%, rgba(255,255,255,0.04) 0%, transparent 70%)',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, ease }}
              className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-6"
            >
              Drive with clarity.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-10"
            >
              Stop guessing about fuel economy and expenses. Start tracking properly today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.2 }}
            >
              <Link href="/login">
                <Button className="relative h-14 px-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-lg font-medium shadow-lg overflow-hidden animate-glow-pulse">
                  <motion.span
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                    initial={{ x: '-110%' }}
                    animate={{ x: '220%' }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: 'linear', repeatDelay: 2 }}
                  />
                  <span className="relative z-10">Create Account</span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════ */}
        <footer className="py-12 px-6 bg-background">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-foreground">
              <div className="h-6 w-6 relative overflow-hidden rounded">
                <img src={logoSrc} alt="FuelUp" className="h-full w-full object-contain opacity-70" />
              </div>
              <span className="text-sm font-medium tracking-tight">FuelUp Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FuelUp. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
