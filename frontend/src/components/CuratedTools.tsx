import ToolCard from "@/components/ToolCard";
import { getTools } from "@/lib/api";

export default async function CuratedTools() {
  const { data: latestTools } = await getTools(1, 4);

  if (!latestTools || latestTools.length === 0) {
    return (
      <p className="text-muted-foreground py-8 italic font-sans col-span-full text-center">
        Catalog currently unavailable.
      </p>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {latestTools.map((tool: any) => (
        <ToolCard key={tool._id} tool={tool} />
      ))}
    </>
  );
}
