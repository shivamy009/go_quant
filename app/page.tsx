// app/page.tsx
'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const GlobeClient = dynamic(() => import('../components/GlobeClient'), { ssr: false });

export default function Page() {
  return (
    <main>
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Latency Topology Visualizer</h1>
        <p className="text-slate-300">Real-time latency (SSE) + optional RIPE Atlas integration. Demo mode uses TCP connect measurements.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-black rounded-lg overflow-hidden p-2">
          <GlobeClient />
        </div>

        <aside className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h2 className="font-semibold">Controls</h2>
            <p className="text-slate-300 text-sm">Filter markers, select server for history, export CSV.</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h2 className="font-semibold">Legend</h2>
            <ul className="mt-2 text-sm text-slate-200">
              <li><span className="font-medium">Green</span>: &lt; 50ms</li>
              <li><span className="font-medium">Yellow</span>: 50–150ms</li>
              <li><span className="font-medium">Red</span>: &gt; 150ms</li>
              <li><span className="font-medium">Gray</span>: timeout / error</li>
            </ul>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg">
            <h2 className="font-semibold">Notes</h2>
            <p className="text-slate-300 text-sm">SSE endpoint: <code className="text-xs">/api/latency/stream</code></p>
            <p className="text-slate-300 text-sm mt-2">For production or heavy probe usage, run the worker in a dedicated Node process / container.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
