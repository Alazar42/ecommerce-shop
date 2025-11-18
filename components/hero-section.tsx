'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import FeaturedSVG from '@/public/public-featured.svg'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-card py-20 md:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 items-center">
          {/* Left content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2 w-fit">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  New Collection
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance dark:text-white">
                Discover Your Next
                <span className="block bg-gradient-to-r from-accent to-accent/70 bg-clip-text">
                  Favorite Product
                </span>
              </h1>
              <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-md leading-relaxed">
                Explore our curated collection of premium products. From timeless classics to modern innovations, find everything you need in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="#products">
                <Button size="lg" className="gap-2">
                  Explore Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/create">
                <Button size="lg" variant="outline">
                  Add Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Featured product showcase */}
          <div className="hidden md:flex items-center justify-center">
            <img
              src="/public-featured.svg"
              alt="Featured Product"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-3 gap-4 mt-16 pt-16 border-t border-border md:grid-cols-4">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-foreground">10K+</p>
            <p className="text-sm text-muted-foreground">Products</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-foreground">50K+</p>
            <p className="text-sm text-muted-foreground">Happy Customers</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-foreground">99%</p>
            <p className="text-sm text-muted-foreground">Satisfaction</p>
          </div>
          <div className="hidden md:block">
            <p className="text-2xl md:text-3xl font-bold text-foreground">24/7</p>
            <p className="text-sm text-muted-foreground">Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}
