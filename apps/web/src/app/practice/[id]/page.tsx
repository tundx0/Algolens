import { PracticeProblem } from "@/components/PracticeProblem";

export default async function PracticeProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PracticeProblem id={id} />;
}
