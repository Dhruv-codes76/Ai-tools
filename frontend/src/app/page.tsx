import Link from "next/link";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import NewsCard from "@/components/NewsCard";
import ToolCard from "@/components/ToolCard";
import { getNews, getTools } from "@/lib/api";

export default async function Home() {
  const { data: latestNews } = await getNews(1, 3);
  const { data: latestTools } = await getTools(1, 4);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center selection:bg-foreground selection:text-background">

      {/* Editorial Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 border-b-2 border-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="max-w-4xl">
            <h1 className="font-sans font-bold text-5xl md:text-8xl tracking-tight leading-[1.05] mb-6 text-foreground">
              Unbiased AI Insights. <br />
              <span className="italic font-normal text-muted-foreground">Absolute clarity.</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Filter the robust signal from the incessant noise. We bring you real, beginner-friendly AI intelligence and meticulously categorized tooling to supercharge your workflow without the startup hype.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <Link
            href="/news"
            className="px-8 py-4 bg-foreground text-background font-medium text-center uppercase tracking-widest text-sm hover:bg-background hover:text-foreground border border-foreground transition-colors"
          >
            Read Intelligence
          </Link>
          <Link
            href="/tools"
            className="px-8 py-4 bg-background text-foreground font-medium text-center uppercase tracking-widest text-sm border border-border hover:border-foreground transition-colors"
          >
            Explore Tools
          </Link>
        </div>
      </section>

      {/* Main Content Split Layout */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Left Column: Latest News List */}
        <div className="lg:col-span-12">
          <div className="flex justify-between items-baseline border-b-4 border-foreground pb-4 mb-8">
            <h2 className="text-3xl font-sans font-bold tracking-tight uppercase">Latest Dispatches</h2>
            <Link href="/news" className="text-sm tracking-widest uppercase font-bold text-muted-foreground hover:text-foreground transition-colors">
              View Directory
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {latestNews && latestNews.length > 0 ? (
              latestNews.map((news: any) => (
                <NewsCard key={news._id} news={news} />
              ))
            ) : (
              <p className="text-muted-foreground py-8 italic font-sans">No transmissions currently active.</p>
            )}
          </div>
        </div>

        {/* Right Column: Featured Tools Sidebar Grid */}
        <div className="lg:col-span-12 mt-12">
          <div className="flex justify-between items-baseline border-b-4 border-foreground pb-4 mb-8">
            <h2 className="text-3xl font-sans font-bold tracking-tight uppercase">Curated Tools</h2>
            <Link href="/tools" className="text-sm tracking-widest uppercase font-bold text-muted-foreground hover:text-foreground transition-colors">
              All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {latestTools && latestTools.length > 0 ? (
              latestTools.map((tool: any) => (
                <ToolCard key={tool._id} tool={tool} />
              ))
            ) : (
              <p className="text-muted-foreground py-8 italic font-sans">Catalog currently unavailable.</p>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}
