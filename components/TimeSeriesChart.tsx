// components/TimeSeriesChart.tsx
'use client';
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

type Sample = { timestamp: string; rttMs: number | null; status: string };

interface TimeSeriesChartProps {
  data: Sample[];
  serverId: string;
  timeRange?: string;
}

export default function TimeSeriesChart({ data, serverId, timeRange = '1h' }: TimeSeriesChartProps) {
  const stats = useMemo(() => {
    const validRtts = data.filter(d => d.rttMs !== null).map(d => d.rttMs as number);
    if (validRtts.length === 0) return { min: 0, max: 0, avg: 0, samples: 0 };
    
    return {
      min: Math.min(...validRtts),
      max: Math.max(...validRtts),
      avg: Math.round(validRtts.reduce((a, b) => a + b, 0) / validRtts.length),
      samples: validRtts.length
    };
  }, [data]);

  const csvHeader = 'timestamp,rttMs,status\n';
  const csvBody = data.map((d) => `${d.timestamp},${d.rttMs ?? ''},${d.status}`).join('\n');
  const csv = csvHeader + csvBody;

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serverId}_latency_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    const jsonData = {
      serverId,
      timeRange,
      exportTime: new Date().toISOString(),
      statistics: stats,
      data
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serverId}_latency_${timeRange}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTimeFormat = (timeRange: string) => {
    switch (timeRange) {
      case '1h': return (time: string) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '24h': return (time: string) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '7d': return (time: string) => new Date(time).toLocaleDateString([], { month: 'short', day: 'numeric' });
      case '30d': return (time: string) => new Date(time).toLocaleDateString([], { month: 'short', day: 'numeric' });
      default: return (time: string) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      timestampLabel: getTimeFormat(timeRange)(d.timestamp),
      rttMs: d.rttMs ?? undefined
    }));
  }, [data, timeRange]);

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400">No data available for the selected time range</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Server Info and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-semibold text-lg">{serverId}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stats.samples} samples • {timeRange} range
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadCsv}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          >
            📊 CSV
          </button>
          <button
            onClick={downloadJson}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
          >
            📄 JSON
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.min}ms</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Min</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.avg}ms</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Avg</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">{stats.max}ms</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Max</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.samples}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Samples</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis 
                dataKey="timestampLabel" 
                minTickGap={30}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value: any) => [`${value}ms`, 'Latency']}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Legend />
              <ReferenceLine y={50} stroke="#10B981" strokeDasharray="3 3" label="Good" />
              <ReferenceLine y={150} stroke="#F59E0B" strokeDasharray="3 3" label="Fair" />
              <Line 
                type="monotone" 
                dataKey="rttMs" 
                name="RTT (ms)" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ r: 2 }} 
                isAnimationActive={false}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
