"use client";

import { useEffect, useState } from "react";

interface StorageEstimate {
  quota: number;
  usage: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function StorageSection() {
  const [estimate, setEstimate] = useState<StorageEstimate | null>(null);

  useEffect(() => {
    if (!navigator.storage?.estimate) {
      return;
    }
    navigator.storage.estimate().then((est) => {
      if (est.usage !== undefined && est.quota !== undefined) {
        setEstimate({ quota: est.quota, usage: est.usage });
      }
    });
  }, []);

  const pct =
    estimate && estimate.quota > 0
      ? Math.min(100, (estimate.usage / estimate.quota) * 100)
      : 0;

  return (
    <section className="flex flex-col gap-3">
      <span className="font-mono text-[11px] text-text-2 uppercase tracking-widest">
        STORAGE
      </span>

      <div className="flex flex-col gap-3 rounded-xl border border-line bg-bg-2 px-4 py-4">
        {estimate ? (
          <>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[13px] text-text">
                {formatBytes(estimate.usage)}
              </span>
              <span className="font-mono text-[11px] text-text-3">
                of {formatBytes(estimate.quota)} available
              </span>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-bg-3">
              <div
                className="absolute top-0 bottom-0 left-0 rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-text-3">
              IndexedDB · {pct.toFixed(2)}% used
            </span>
          </>
        ) : (
          <span className="font-mono text-[12px] text-text-3">
            Storage info unavailable
          </span>
        )}
      </div>
    </section>
  );
}
