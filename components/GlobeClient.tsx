// components/GlobeClient.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { latencyColor } from '../lib/utils';
import TimeSeriesChart from './TimeSeriesChart';
import Loader from './Loader';

type Server = {
  id: string;
  exchange: string;
  provider: string;
  regionCode: string;
  lat: number;
  lng: number;
  host: string;
  port: number;
};

type LatencySample = {
  id: string;
  host: string;
  port: number;
  timestamp: string;
  rttMs: number | null;
  status: string;
};

export default function GlobeClient() {
  const globeRef = useRef<any>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [latest, setLatest] = useState<Record<string, LatencySample>>({});
  const [arcs, setArcs] = useState<any[]>([]);
  const [points, setPoints] = useState<any[]>([]);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [history, setHistory] = useState<LatencySample[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // initial load of servers via REST
    fetch('/api/servers')
      .then((r) => r.json())
      .then((d) => setServers(d.servers || [])).catch(()=>{});
  }, []);

  useEffect(() => {
    const es = new EventSource('/api/latency/stream');
    es.onopen = () => setConnected(true);
    es.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.servers) setServers(msg.servers);
      if (msg.latest) setLatest(msg.latest);
    };
    es.onerror = () => {
      setConnected(false);
      es.close();
    };
    return () => es.close();
  }, []);

  useEffect(() => {
    // build points & arcs whenever servers/latest update
    const pts = servers.map((s) => {
      const sample = latest[s.id];
      const rtt = sample?.rttMs ?? null;
      return {
        id: s.id,
        lat: s.lat,
        lng: s.lng,
        size: 0.7,
        color: rtt === null ? '#888888' : (rtt < 50 ? '#00ff7f' : rtt < 150 ? '#ffeb3b' : '#ff4d4f'),
        label: `${s.exchange} (${s.provider})\n${s.host}:${s.port}\nlatency: ${rtt !== null ? rtt + ' ms' : sample?.status ?? 'n/a'}`
      };
    });

    const pairs: any[] = [];
    for (let i = 0; i < servers.length; i++) {
      for (let j = i + 1; j < servers.length; j++) {
        const a = servers[i];
        const b = servers[j];
        const ra = latest[a.id]?.rttMs ?? null;
        const rb = latest[b.id]?.rttMs ?? null;
        const avg = [ra, rb].filter(Boolean).length ? Math.round(((ra || 9999) + (rb || 9999)) / 2) : null;
        const color = avg === null ? '#888888' : avg < 50 ? '#00ff7f' : avg < 150 ? '#ffeb3b' : '#ff4d4f';
        pairs.push({
          startLat: a.lat,
          startLng: a.lng,
          endLat: b.lat,
          endLng: b.lng,
          color,
          stroke: 0.6,
          arcLabel: `${a.exchange} ↔ ${b.exchange}\navg: ${avg !== null ? avg + ' ms' : 'n/a'}`
        });
      }
    }

    setPoints(pts);
    setArcs(pairs);
  }, [servers, latest]);

  useEffect(() => {
    if (!selectedServer) return;
    setLoadingHistory(true);
    const to = new Date().toISOString();
    const from = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // last 1 hour default
    fetch(`/api/latency/history?serverId=${selectedServer}&from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((d) => {
        setHistory(d.history || []);
      })
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false));
  }, [selectedServer]);

  if (!servers.length) return <Loader />;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="canvas-container">
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundColor="rgba(0,0,0,0)"
            pointsData={points}
            pointLat="lat"
            pointLng="lng"
            pointAltitude={() => 0.01}
            pointRadius="size"
            pointColor="color"
            pointLabel="label"
            onPointClick={(p: any) => setSelectedServer(p.id)}
            arcsData={arcs}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcStroke="stroke"
            arcAltitude={0.2}
            arcLabel="arcLabel"
            width={800}
            height={600}
          />
        </div>
        <div className="mt-2 text-sm text-slate-300">
          SSE status: {connected ? <span className="text-green-400">connected</span> : <span className="text-red-400">disconnected</span>}
        </div>
      </div>

      <div className="w-full lg:w-96 space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="font-semibold">Servers</h3>
          <ul className="mt-2 text-sm">
            {servers.map((s) => {
              const r = latest[s.id]?.rttMs ?? null;
              return (
                <li key={s.id} className="flex justify-between py-1 border-b border-slate-700">
                  <div>
                    <div className="font-medium">{s.exchange} <span className="text-xs text-slate-400">({s.provider})</span></div>
                    <div className="text-xs text-slate-400">{s.host}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{r !== null ? r + ' ms' : (latest[s.id]?.status ?? 'n/a')}</div>
                    <button className="text-xs text-indigo-300" onClick={() => setSelectedServer(s.id)}>View</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="font-semibold">Selected Server History</h3>
          {!selectedServer && <div className="text-slate-400 text-sm">Click a server on the globe or choose from the list.</div>}
          {selectedServer && loadingHistory && <div className="text-slate-300">Loading history…</div>}
          {selectedServer && !loadingHistory && <TimeSeriesChart data={history} serverId={selectedServer} />}
        </div>
      </div>
    </div>
  );
}
