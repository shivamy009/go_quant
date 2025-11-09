// components/PerformanceMetrics.tsx
'use client';
import React, { useState, useEffect } from 'react';

interface MetricsData {
  totalServers: number;
  activeConnections: number;
  avgLatency: number;
  failureRate: number;
  lastUpdate: string;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  uptime: number;
}

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<MetricsData>({
    totalServers: 0,
    activeConnections: 0,
    avgLatency: 0,
    failureRate: 0,
    lastUpdate: new Date().toISOString(),
    memoryUsage: 0,
    cpuUsage: 0,
    networkLatency: 0,
    uptime: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Fetch real-time metrics from API
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/latency');
        const data = await response.json();
        
        const totalServers = data.servers?.length || 0;
        const latencies = Object.values(data.latest || {}) as any[];
        const validLatencies = latencies.filter(l => l.rttMs !== null);
        const failedCount = latencies.filter(l => l.status === 'error' || l.status === 'timeout').length;
        const avgLatency = validLatencies.length > 0 
          ? Math.round(validLatencies.reduce((sum: number, l: any) => sum + l.rttMs, 0) / validLatencies.length)
          : 0;
        const failureRate = totalServers > 0 ? (failedCount / totalServers) * 100 : 0;

        setMetrics(prev => ({
          totalServers,
          activeConnections: validLatencies.length,
          avgLatency,
          failureRate,
          lastUpdate: new Date().toISOString(),
          memoryUsage: 45 + Math.random() * 15, // Simulated
          cpuUsage: 20 + Math.random() * 30, // Simulated
          networkLatency: avgLatency || 75 + Math.random() * 50,
          uptime: Math.floor((Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000) // Seconds since midnight
        }));
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    // Initial fetch
    fetchMetrics();
    
    // Update every 5 seconds
    const interval = setInterval(fetchMetrics, 5000);
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

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'text-green-600 dark:text-green-400';
    if (usage < 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 min-w-[320px] max-w-[400px] relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">📊</span>
          System Metrics
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {metrics.totalServers}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Servers</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {metrics.activeConnections}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className={`text-xl font-bold ${getLatencyColor(metrics.avgLatency)}`}>
            {metrics.avgLatency}ms
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Avg Latency</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className={`text-xl font-bold ${getFailureRateColor(metrics.failureRate)}`}>
            {metrics.failureRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Failure Rate</div>
        </div>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className={`text-lg font-bold ${getUsageColor(metrics.memoryUsage)}`}>
            {metrics.memoryUsage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Memory</div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                metrics.memoryUsage < 50 ? 'bg-green-500' : 
                metrics.memoryUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(metrics.memoryUsage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className={`text-lg font-bold ${getUsageColor(metrics.cpuUsage)}`}>
            {metrics.cpuUsage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">CPU</div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                metrics.cpuUsage < 50 ? 'bg-green-500' : 
                metrics.cpuUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(metrics.cpuUsage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-600 dark:text-gray-400">Last Update:</span>
          <span className="font-mono">
            {new Date(metrics.lastUpdate).toLocaleTimeString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-600 dark:text-gray-400">Uptime:</span>
          <span className="font-mono">{formatUptime(metrics.uptime)}</span>
        </div>
        
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            metrics.activeConnections > 0 && metrics.failureRate < 10 ? 'bg-green-400' : 
            metrics.activeConnections > 0 ? 'bg-yellow-400' : 'bg-red-400'
          }`}></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            System: {
              metrics.activeConnections > 0 && metrics.failureRate < 10 ? 'Healthy' :
              metrics.activeConnections > 0 ? 'Degraded' : 'Critical'
            }
          </span>
        </div>
      </div>
    </div>
  );
}