import Link from 'next/link';
import { Gauge, Fuel, BarChart3, Wrench, ArrowRight, Zap, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
              <Gauge className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FuelUp
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Smart Vehicle Management
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight text-center border-2 border-red-500">
            Track Fuel.{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Save Money.
            </span>
            <br />
            Drive Smarter.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The ultimate vehicle management platform. Track fuel expenses, monitor efficiency,
            schedule maintenance, and make data-driven decisions — all in one beautiful app.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="xl" className="gap-2 shadow-lg shadow-primary/25">
                Start Tracking Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="xl" variant="outline" className="gap-2">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Manage Your Vehicles
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From fuel tracking to maintenance reminders, FuelUp has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Fuel,
                title: 'Fuel Tracking',
                description: 'Log fill-ups in seconds. Track costs, efficiency, and fuel trends over time.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: BarChart3,
                title: 'Smart Analytics',
                description: 'Visualize your spending patterns and discover ways to save on fuel costs.',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: Wrench,
                title: 'Maintenance Alerts',
                description: 'Never miss an oil change. Get smart reminders based on mileage and time.',
                gradient: 'from-amber-500 to-orange-500',
              },
              {
                icon: Smartphone,
                title: 'Works Anywhere',
                description: 'PWA-powered. Use on any device, even offline. Syncs seamlessly when online.',
                gradient: 'from-green-500 to-emerald-500',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border bg-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50K+', label: 'Active Users' },
            { value: '2M+', label: 'Fuel Logs' },
            { value: '$4.2M', label: 'Money Saved' },
            { value: '4.9★', label: 'User Rating' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold font-mono text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take Control of Your Vehicle Costs?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of drivers who save money and drive smarter with FuelUp.
          </p>
          <Link href="/login">
            <Button size="xl" className="gap-2 shadow-lg shadow-primary/25">
              Get Started — It&apos;s Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
              <Gauge className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">FuelUp</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FuelUp. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
