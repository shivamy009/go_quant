// app/layout.tsx
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Crypto Exchange Latency Visualizer',
  description: '3D world map visualization of cryptocurrency exchange server latency across AWS, GCP, and Azure regions'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}
