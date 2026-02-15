import { Link } from '@tanstack/react-router';
import { DollarSign, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted/50 to-background">
        <div className="container py-16 md:py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Welcome to{' '}
                  <span className="text-primary">Pinku</span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Streamlined billing management for modern healthcare providers.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/billing"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/assets/generated/healthcare-hero.dim_1600x900.png"
                alt="Pinku healthcare platform illustration"
                className="w-full max-w-2xl rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive healthcare billing solutions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-1 max-w-2xl mx-auto">
            {/* Billing Card */}
            <Link
              to="/billing"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <DollarSign className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold tracking-tight">Billing</h3>
                  <p className="text-muted-foreground">
                    Simplified billing and payment processing. Manage invoices, track payments, and handle insurance claims with ease.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
