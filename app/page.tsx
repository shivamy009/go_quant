// app/page.tsx
'use client';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import ControlPanel from '../components/ControlPanel';
import PerformanceMetrics from '../components/PerformanceMetrics';

const GlobeClient = dynamic(() => import('../components/GlobeClient'), { ssr: false });

export default function Page() {
  const [filters, setFilters] = useState({
    providers: ['AWS', 'GCP', 'Azure', 'Other'],
    exchanges: [] as string[],
    latencyRange: { min: 0, max: 1000 }
  });

  return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Crypto Exchange Latency Visualizer
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Real-time latency monitoring across AWS, GCP, and Azure regions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <PerformanceMetrics />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Globe View */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="h-[600px] sm:h-[700px] relative">
                <GlobeClient filters={filters} />
              </div>
            </div>
          </div>

          {/* Control Panel and Information */}
          <div className="xl:col-span-1 order-1 xl:order-2 space-y-6">
            <ControlPanel filters={filters} onFiltersChange={setFilters} />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🌍</span>
                Legend
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Low Latency
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">&lt; 50ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    Medium Latency
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">50-150ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    High Latency
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">&gt; 150ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                    Timeout/Error
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">N/A</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2">Cloud Providers</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded bg-orange-500 mr-2"></div>
                    <span>AWS</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded bg-blue-500 mr-2"></div>
                    <span>GCP</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded bg-cyan-500 mr-2"></div>
                    <span>Azure</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded bg-purple-500 mr-2"></div>
                    <span>Other</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2">Network Topology</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-green-500 mr-2"></div>
                    <span>Same Provider + Region</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-blue-500 mr-2 border-dashed"></div>
                    <span>Same Provider</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-orange-500 mr-2" style={{borderTop: '1px dotted'}}></div>
                    <span>Same Region</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
                    <span>Cross-Provider</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">📊</span>
                System Info
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Update Interval:</span>
                  <span>5-10 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Data Source:</span>
                  <span>TCP Connect</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">SSE Endpoint:</span>
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">/api/latency/stream</code>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  💡 Click on markers to view detailed historical data and export reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
