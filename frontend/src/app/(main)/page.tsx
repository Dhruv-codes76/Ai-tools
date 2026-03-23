/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import LatestDispatches from "@/components/LatestDispatches";
import CuratedTools from "@/components/CuratedTools";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-foreground selection:text-background">

      {/* Editorial Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 lg:pt-40 lg:pb-40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="max-w-4xl">
            <h1 className="font-sans font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] mb-6 text-foreground">
              Unbiased AI Insights. <br />
              <span className="text-muted-foreground/80 font-medium">Absolute clarity.</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
              Filter the robust signal from the incessant noise. We bring you real, beginner-friendly AI intelligence and meticulously categorized tooling to supercharge your workflow.
            </p>
          </div>
        </div>

        <div className="flex flex-row justify-start gap-4 w-full max-w-lg">
          <Link
            href="/news"
            className="flex flex-1 items-center justify-center px-4 sm:px-8 py-4 sm:py-5 rounded-2xl bg-foreground hover:bg-foreground/90 text-background font-semibold text-center uppercase tracking-widest text-xs sm:text-sm shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 active:scale-95 border border-transparent dark:border-white/10"
          >
            Read Intelligence
          </Link>
          <Link
            href="/tools"
            className="flex flex-1 items-center justify-center px-4 sm:px-8 py-4 sm:py-5 rounded-2xl bg-muted/80 dark:bg-white/10 backdrop-blur-md text-foreground font-semibold text-center uppercase tracking-widest text-xs sm:text-sm border border-border/50 dark:border-white/10 shadow-sm transition-all duration-300 hover:bg-muted dark:hover:bg-white/20 hover:shadow-md hover:-translate-y-1 hover:scale-105 active:scale-95"
          >
            Explore Tools
          </Link>
        </div>
      </section>

      {/* Seamless separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50"></div>

      {/* Main Content Split Layout */}
      <section className="w-full bg-muted/10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 pb-32 md:pb-24">

          {/* Left Column: Latest News List */}
          <div className="lg:col-span-12">
            <div className="flex justify-between items-end border-b-2 border-border pb-4 mb-10">
              <h2 className="text-3xl lg:text-4xl font-sans font-bold tracking-tight text-foreground">Latest Dispatches</h2>
              <Link href="/news" className="group flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                View Directory <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              <Suspense fallback={<><div className="w-full h-80 bg-muted animate-pulse rounded-2xl"></div><div className="w-full h-80 bg-muted animate-pulse rounded-2xl hidden md:block"></div><div className="w-full h-80 bg-muted animate-pulse rounded-2xl hidden lg:block"></div></>}>
                <LatestDispatches />
              </Suspense>
            </div>
          </div>

          {/* Right Column: Featured Tools Sidebar Grid */}
          <div className="lg:col-span-12 pt-8">
            <div className="flex justify-between items-end border-b-2 border-border pb-4 mb-10">
              <h2 className="text-3xl lg:text-4xl font-sans font-bold tracking-tight text-foreground">Curated Tools</h2>
              <Link href="/tools" className="group flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                Explore All <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
              <Suspense fallback={<><div className="w-full h-40 bg-muted animate-pulse rounded-2xl"></div><div className="w-full h-40 bg-muted animate-pulse rounded-2xl"></div><div className="w-full h-40 bg-muted animate-pulse rounded-2xl hidden lg:block"></div><div className="w-full h-40 bg-muted animate-pulse rounded-2xl hidden lg:block"></div></>}>
                <CuratedTools />
              </Suspense>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
