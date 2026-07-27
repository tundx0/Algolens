import { PathwayDetail } from "@/components/pathways/PathwayDetail";
import { SiteNav } from "@/components/SiteNav";

export default async function PathwayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="min-h-dvh">
      <SiteNav containerClassName="max-w-[760px]" />
      <PathwayDetail id={id} />
    </div>
  );
}
