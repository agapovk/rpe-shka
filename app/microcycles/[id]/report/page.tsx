import { MicrocycleReportView } from "@views/microcycle-report";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MicrocycleReportPage({ params }: PageProps) {
  const { id } = await params;
  return <MicrocycleReportView microcycleId={Number(id)} />;
}
