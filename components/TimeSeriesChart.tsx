// components/TimeSeriesChart.tsx
'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Sample = { timestamp: string; rttMs: number | null; status: string };

export default function TimeSeriesChart({ data, serverId }: { data: Sample[]; serverId: string }) {
  const csvHeader = 'timestamp,rttMs,status\n';
  const csvBody = data.map((d) => `${d.timestamp},${d.rttMs ?? ''},${d.status}`).join('\n');
  const csv = csvHeader + csvBody;

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serverId}_latency_history.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = data.map((d) => ({ ...d, timestampLabel: new Date(d.timestamp).toLocaleTimeString(), rttMs: d.rttMs ?? undefined }));

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">{serverId}</div>
        <button onClick={downloadCsv} className="px-3 py-1 bg-indigo-500 rounded text-sm">Export CSV</button>
      </div>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="timestampLabel" minTickGap={20} />
            <YAxis />
            <Tooltip labelFormatter={(l) => new Date(l as string).toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="rttMs" name="RTT (ms)" stroke="#00ff7f" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
