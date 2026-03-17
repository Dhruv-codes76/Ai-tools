import Link from "next/link";
import { ArrowRight, Sparkles, Mail, LayoutGrid, Zap } from "lucide-react";

import NewsCard from "@/components/NewsCard";
import ToolCard from "@/components/ToolCard";
import { getNews, getTools } from "@/lib/api";

export default async function Home() {
  const { data: latestNews } = await getNews(1, 6);
  const { data: latestTools } = await getTools(1, 4);

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-primary selection:text-white">

      {/* Editorial Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-24 lg:py-40 border-b border-border">
        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 dark:opacity-30 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-primary/30 shadow-[0_0_15px_rgba(0,191,255,0.2)] text-primary text-xs font-bold tracking-widest uppercase mb-8 transform transition-transform hover:scale-105">
                <Sparkles className="w-4 h-4" /> The future of intelligence
            </div>

            <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[1.05] mb-8 text-foreground max-w-5xl mx-auto">
                Unbiased AI Insights. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-cyan-400">Absolute clarity.</span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed font-medium mb-12">
                Filter the robust signal from the incessant noise. We bring you real, beginner-friendly AI intelligence and meticulously categorized tooling to supercharge your workflow.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mx-auto">
                <Link
                    href="/news"
                    className="group relative flex flex-1 items-center justify-center px-8 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-center uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(0,191,255,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,191,255,0.5)] hover:-translate-y-1 hover:scale-105 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Read Intelligence <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none" />
                </Link>

                <Link
                    href="/tools"
                    className="flex flex-1 items-center justify-center px-8 py-5 rounded-2xl bg-background text-foreground font-bold text-center uppercase tracking-widest text-sm border-2 border-border shadow-sm transition-all duration-300 hover:bg-muted/50 hover:border-primary/50 hover:-translate-y-1 hover:scale-105"
                >
                    <LayoutGrid className="w-4 h-4 mr-2 text-primary" /> Explore Tools
                </Link>
            </div>
        </div>
      </section>

      {/* Main Content Split Layout */}
      <section className="w-full bg-muted/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 grid grid-cols-1 gap-16 lg:gap-24">

          {/* Left Column: Latest News List */}
          <div className="w-full">
            <div className="flex justify-between items-end border-b-2 border-border pb-6 mb-12">
              <h2 className="text-3xl lg:text-5xl font-heading font-black tracking-tight text-foreground flex items-center gap-3">
                 <Zap className="text-primary w-8 h-8 lg:w-10 lg:h-10" /> Latest Dispatches
              </h2>
              <Link href="/news" className="group flex items-center text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
                View Directory <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {latestNews && latestNews.length > 0 ? (
                latestNews.map((news: any) => (
                  <NewsCard key={news._id || news.id} news={news} />
                ))
              ) : (
                <div className="col-span-full py-16 px-6 border-2 border-dashed border-border rounded-3xl bg-card text-center flex flex-col items-center justify-center">
                    <Mail className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-2">Transmissions Pending</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">Our intelligence network is currently gathering new dispatches. Check back shortly or subscribe to receive immediate updates.</p>
                    <button className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-md hover:-translate-y-0.5 transition-transform uppercase tracking-widest">
                        Notify Me
                    </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Featured Tools Sidebar Grid */}
          <div className="w-full">
            <div className="flex justify-between items-end border-b-2 border-border pb-6 mb-12">
              <h2 className="text-3xl lg:text-5xl font-heading font-black tracking-tight text-foreground flex items-center gap-3">
                  <LayoutGrid className="text-primary w-8 h-8 lg:w-10 lg:h-10" /> Curated Tools
              </h2>
              <Link href="/tools" className="group flex items-center text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
                Explore All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
              {latestTools && latestTools.length > 0 ? (
                latestTools.map((tool: any) => (
                  <ToolCard key={tool._id || tool.id} tool={tool} />
                ))
              ) : (
                <div className="col-span-full py-16 px-6 border-2 border-dashed border-border rounded-3xl bg-card text-center flex flex-col items-center justify-center">
                    <Sparkles className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-2">Catalog Engineering in Progress</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">We are meticulously curating and testing the next generation of AI tools. The full catalog experience will be available in our upcoming release.</p>
                    <button className="px-6 py-3 bg-background border-2 border-border text-foreground font-bold rounded-xl text-sm shadow-sm hover:border-primary/50 hover:bg-muted transition-all uppercase tracking-widest">
                        Join Waitlist
                    </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
