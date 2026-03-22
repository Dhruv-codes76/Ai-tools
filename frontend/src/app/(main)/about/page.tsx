import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | AI Portal Weekly',
  description: 'A "One-Stop Destination" for AI that bridges the gap for beginners using "Down-to-Reality" information. No hype, just reality.',
};

export default function AboutPage() {
  return (
    <div className="min-h-[80vh] bg-transparent text-slate-900 dark:text-neutral-100 flex flex-col pt-16 pb-20 px-4 sm:px-6 font-sans transition-colors duration-300">
      <main className="flex-1 max-w-3xl mx-auto w-full space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">About AI Portal Weekly</h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Bridging the gap for beginners with down-to-reality information.
          </p>
        </header>

        <section className="space-y-6 text-lg leading-relaxed text-foreground">
          <p>
            Welcome to AI Portal Weekly. We built this platform because we were tired of the "hype cycle." In a world where every new tool is marketed as "revolutionary" or a "game-changer," it’s hard to know what actually works.
          </p>
          <p>
            Our core mission is simple: <strong>No hype. No overcomplication. Just facts.</strong>
          </p>
          <p>
            We don't sell dreams. We explain what tools actually do, what they don't do, and what they cost in plain language. Every piece of content here is designed to answer one question: <em>What does this actually do for a normal person?</em>
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Our Core Principles</h2>
          
          <div className="space-y-8">
            <div className="border-l-4 border-slate-200 dark:border-neutral-800 pl-6">
              <h3 className="text-xl font-medium mb-2 text-foreground">1. No Hype</h3>
              <p className="text-muted-foreground">
                We prioritize honesty and limitations over marketing. AI is an incredible tool, but it is not magic. We present things neutrally, acknowledging real-world limitations and trade-offs.
              </p>
            </div>

            <div className="border-l-4 border-slate-200 dark:border-neutral-800 pl-6">
              <h3 className="text-xl font-medium mb-2 text-foreground">2. Clarity Over Jargon</h3>
              <p className="text-muted-foreground">
                You shouldn't need a PhD in computer science to understand how a tool works. We use plain English and focus on practical day-to-day utility.
              </p>
            </div>

            <div className="border-l-4 border-slate-200 dark:border-neutral-800 pl-6">
              <h3 className="text-xl font-medium mb-2 text-foreground">3. Human-Verified Trust</h3>
              <p className="text-muted-foreground">
                If we haven't tested it, we'll say so. Our directory focuses on providing a clear "What this does" and "Who this is not for" so you can make informed decisions quickly.
              </p>
            </div>
          </div>
        </section>

        <footer className="pt-12 border-t border-slate-200 dark:border-neutral-800">
          <p className="text-muted-foreground">
            Have questions or want to see a tool featured? <Link href="/" className="underline underline-offset-4 hover:text-foreground transition-colors">Return home</Link>.
          </p>
        </footer>
      </main>
    </div>
  );
}
