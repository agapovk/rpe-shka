export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col items-center overflow-hidden md:p-6">
      <div className="relative flex w-full max-w-3xl flex-1 flex-col overflow-hidden bg-bg-1 px-4 py-5 sm:px-7 sm:py-8 md:rounded-[28px] md:border md:border-line">
        {children}
      </div>
    </div>
  );
}
