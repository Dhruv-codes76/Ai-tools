import Link from "next/link";

export const metadata = {
    title: "Privacy Policy | AI MVP",
    description: "Our commitment to your privacy and data security.",
};

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Link href="/" className="inline-block text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground mb-12 transition-colors">
                &larr; Return Home
            </Link>

            <article>
                <header className="border-b-4 border-foreground pb-8 mb-10">
                    <h1 className="text-4xl md:text-6xl font-sans font-bold tracking-tight leading-none mb-6 text-foreground">
                        Privacy Policy
                    </h1>
                    <div className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
                        Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none mb-16 font-sans text-muted-foreground leading-loose">
                    <p>
                        Your privacy is critically important to us. At AI MVP, we have a few fundamental principles:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 mb-8">
                        <li>We don't ask you for personal information unless we truly need it.</li>
                        <li>We don't share your personal information with anyone except to comply with the law, develop our products, or protect our rights.</li>
                        <li>We don't store personal information on our servers unless required for the on-going operation of one of our services.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">1. Information We Collect</h2>
                    <p>
                        We only collect information about you if we have a reason to do so—for example, to provide our Services, to communicate with you, or to make our Services better.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">2. How We Use Information</h2>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect AI MVP and our users.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">3. Security</h2>
                    <p>
                        While no online service is 100% secure, we work very hard to protect information about you against unauthorized access, use, alteration, or destruction, and take reasonable measures to do so.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">4. Changes to this Policy</h2>
                    <p>
                        Although most changes are likely to be minor, AI MVP may change its Privacy Policy from time to time. We encourage visitors to frequently check this page for any changes.
                    </p>
                </div>
            </article>
        </div>
    );
}
