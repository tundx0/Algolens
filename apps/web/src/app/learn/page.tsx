import { LearningPath } from "@/components/LearningPath";
import { SiteNav } from "@/components/SiteNav";

export default function LearnPage() {
  return (
    <div className="min-h-dvh">
      <SiteNav containerClassName="max-w-[820px]" />
      <LearningPath />
    </div>
  );
}
