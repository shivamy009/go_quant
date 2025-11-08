// components/PerformanceMetrics.tsx
'use client';
import React, { useState, useEffect } from 'react';

interface MetricsData {
  totalServers: number;
  activeConnections: number;
  avgLatency: number;
  failureRate: number;
  lastUpdate: string;
}

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<MetricsData>({
    totalServers: 0,
    activeConnections: 0,
    avgLatency: 0,
    failureRate: 0,
    lastUpdate: new Date().toISOString()
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics({
        totalServers: 12 + Math.floor(Math.random() * 3),
        activeConnections: 8 + Math.floor(Math.random() * 4),
        avgLatency: 75 + Math.floor(Math.random() * 50),
        failureRate: Math.random() * 5,
        lastUpdate: new Date().toISOString()
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return 'text-green-600 dark:text-green-400';
    if (latency < 100) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getFailureRateColor = (rate: number) => {
    if (rate < 1) return 'text-green-600 dark:text-green-400';
    if (rate < 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
      >
        <span>📊</span>
        <span>Metrics</span>
        <div className={`w-2 h-2 rounded-full ${metrics.activeConnections > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 min-w-[300px] relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">📊</span>
          Performance Metrics
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {metrics.totalServers}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Servers</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {metrics.activeConnections}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Connections</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className={`text-2xl font-bold ${getLatencyColor(metrics.avgLatency)}`}>
            {metrics.avgLatency}ms
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Latency</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className={`text-2xl font-bold ${getFailureRateColor(metrics.failureRate)}`}>
            {metrics.failureRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Failure Rate</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Last Update:</span>
          <span className="font-mono">
            {new Date(metrics.lastUpdate).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <div className={`w-2 h-2 rounded-full mr-2 ${metrics.activeConnections > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            System Status: {metrics.activeConnections > 0 ? 'Operational' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
}