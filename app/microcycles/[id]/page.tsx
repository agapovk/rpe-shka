import { MicrocycleView } from "@views/microcycle";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MicrocyclePage({ params }: PageProps) {
  const { id } = await params;
  return <MicrocycleView microcycleId={Number(id)} />;
}
