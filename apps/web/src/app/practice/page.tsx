import { PracticeList } from "@/components/PracticeList";
import { SiteNav } from "@/components/SiteNav";

export default function PracticePage() {
  return (
    <div className="min-h-dvh">
      <SiteNav containerClassName="max-w-[820px]" />
      <PracticeList />
    </div>
  );
}
