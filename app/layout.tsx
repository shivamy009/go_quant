// app/layout.tsx
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Latency Topology Visualizer',
  description: '3D globe with real-time latency visualization'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white min-h-screen">
        <div className="max-w-7xl mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
