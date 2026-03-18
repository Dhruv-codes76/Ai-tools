import ToolCard from "@/components/ToolCard";
import { getTools } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export const metadata = {
    title: "Explore AI Tools | Curated Editorial",
    description: "Find the exact AI tool you need. No hype, just facts.",
};

export default async function ToolsPage() {
    const tools = await getTools();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <PageHeader 
                title="AI Tools Catalog" 
                subtitle="Carefully vetted. Highly actionable." 
            />

            {tools && tools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tools.map((tool: any) => (
                        <ToolCard key={tool._id} tool={tool} />
                    ))}
                </div>
            ) : (
                <EmptyState message="No tools cataloged yet." />
            )}
        </div>
    );
}
