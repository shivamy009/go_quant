// components/GlobeClient.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { latencyColor } from '../lib/utils';
import TimeSeriesChart from './TimeSeriesChart';
import Loader from './Loader';

type CloudRegion = {
  id: string;
  provider: string;
  regionCode: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
};

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

type Filters = {
  providers: string[];
  exchanges: string[];
  latencyRange: { min: number; max: number };
};

interface GlobeClientProps {
  filters: Filters;
}

export default function GlobeClient({ filters }: GlobeClientProps) {
  const globeRef = useRef<any>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [cloudRegions, setCloudRegions] = useState<CloudRegion[]>([]);
  const [latest, setLatest] = useState<Record<string, LatencySample>>({});
  const [arcs, setArcs] = useState<any[]>([]);
  const [points, setPoints] = useState<any[]>([]);
  const [rings, setRings] = useState<any[]>([]);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [history, setHistory] = useState<LatencySample[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [connected, setConnected] = useState(false);
  const [timeRange, setTimeRange] = useState('1h');
  const [showArcs, setShowArcs] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTopology, setShowTopology] = useState(false);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [globeSize, setGlobeSize] = useState({ width: 800, height: 600 });

  // Responsive globe sizing
  useEffect(() => {
    const updateSize = () => {
      const container = globeRef.current?.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        setGlobeSize({
          width: Math.max(300, rect.width - 20),
          height: Math.max(300, Math.min(600, rect.height - 20))
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    // initial load of servers via REST
    fetch('/api/servers')
      .then((r) => r.json())
      .then((d) => setServers(d.servers || [])).catch(()=>{});
    
    // Load cloud regions
    fetch('/data/cloudRegions.json')
      .then((r) => r.json())
      .then((regions) => setCloudRegions(regions || [])).catch(()=>{});
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
    const filteredServers = servers.filter(s => {
      const providerMatch = filters.providers.includes(s.provider);
      const exchangeMatch = filters.exchanges.length === 0 || filters.exchanges.includes(s.exchange);
      const sample = latest[s.id];
      const rtt = sample?.rttMs ?? null;
      const latencyMatch = rtt === null || (rtt >= filters.latencyRange.min && rtt <= filters.latencyRange.max);
      
      return providerMatch && exchangeMatch && latencyMatch;
    });

    const getProviderColor = (provider: string) => {
      switch (provider) {
        case 'AWS': return '#FF9900';
        case 'GCP': return '#4285F4';
        case 'Azure': return '#00BCF2';
        default: return '#8B5CF6';
      }
    };

    const pts = filteredServers.map((s) => {
      const sample = latest[s.id];
      const rtt = sample?.rttMs ?? null;
      return {
        id: s.id,
        lat: s.lat,
        lng: s.lng,
        size: 0.8,
        color: getProviderColor(s.provider),
        label: `${s.exchange} (${s.provider})\n${s.regionCode}\n${s.host}:${s.port}\nLatency: ${rtt !== null ? rtt + ' ms' : sample?.status ?? 'n/a'}`
      };
    });

    // Cloud region rings
    const regionRings = showRegions ? cloudRegions.filter(region => 
      filters.providers.includes(region.provider)
    ).map(region => ({
      lat: region.lat,
      lng: region.lng,
      maxR: region.radius / 1000, // Convert to globe units
      propagationSpeed: 1,
      repeatPeriod: 2000,
      color: getProviderColor(region.provider),
      label: `${region.provider} ${region.name}\n${region.regionCode}`
    })) : [];

    // Heatmap data based on latency
    const heatmap = showHeatmap ? filteredServers.map(server => {
      const sample = latest[server.id];
      const rtt = sample?.rttMs ?? null;
      let weight = 0;
      if (rtt !== null) {
        // Convert latency to heat intensity (higher latency = more heat)
        weight = Math.min(rtt / 200, 1); // Normalize to 0-1 range
      }
      return {
        lat: server.lat,
        lng: server.lng,
        weight: weight,
        val: rtt
      };
    }).filter(h => h.weight > 0) : [];

    const pairs: any[] = [];
    if (showArcs || showTopology) {
      for (let i = 0; i < filteredServers.length; i++) {
        for (let j = i + 1; j < filteredServers.length; j++) {
          const a = filteredServers[i];
          const b = filteredServers[j];
          const ra = latest[a.id]?.rttMs ?? null;
          const rb = latest[b.id]?.rttMs ?? null;
          const avg = [ra, rb].filter(Boolean).length ? Math.round(((ra || 9999) + (rb || 9999)) / 2) : null;
          
          let color, stroke, altitude, strokeDasharray;
          
          if (showTopology) {
            // Network topology mode - different styles for different connection types
            const isSameProvider = a.provider === b.provider;
            const isSameRegion = a.regionCode.split('-')[0] === b.regionCode.split('-')[0]; // Same geographic region
            
            if (isSameProvider && isSameRegion) {
              // Same provider, same region - thick green line
              color = '#10B981';
              stroke = 0.8;
              altitude = 0.1;
              strokeDasharray = undefined;
            } else if (isSameProvider) {
              // Same provider, different region - dashed blue line
              color = '#3B82F6';
              stroke = 0.6;
              altitude = 0.15;
              strokeDasharray = [3, 3];
            } else if (isSameRegion) {
              // Different provider, same region - dotted orange line
              color = '#F59E0B';
              stroke = 0.4;
              altitude = 0.08;
              strokeDasharray = [1, 2];
            } else {
              // Different provider, different region - thin red line
              color = '#EF4444';
              stroke = 0.3;
              altitude = 0.2;
              strokeDasharray = undefined;
            }
          } else {
            // Regular latency mode
            color = avg === null ? '#888888' : avg < 50 ? '#00ff7f' : avg < 150 ? '#ffeb3b' : '#ff4d4f';
            stroke = 0.4;
            altitude = 0.15;
            strokeDasharray = undefined;
          }
          
          pairs.push({
            startLat: a.lat,
            startLng: a.lng,
            endLat: b.lat,
            endLng: b.lng,
            color,
            stroke,
            arcAltitude: altitude,
            strokeDasharray,
            arcLabel: showTopology 
              ? `${a.exchange} ↔ ${b.exchange}\nProvider: ${a.provider === b.provider ? a.provider : `${a.provider} ↔ ${b.provider}`}\nLatency: ${avg !== null ? avg + ' ms' : 'n/a'}`
              : `${a.exchange} ↔ ${b.exchange}\nAvg: ${avg !== null ? avg + ' ms' : 'n/a'}`
          });
        }
      }
    }

    setPoints(pts);
    setArcs(pairs);
    setRings(regionRings);
    setHeatmapData(heatmap);
  }, [servers, latest, filters, showArcs, showRegions, showHeatmap, showTopology, cloudRegions]);

  useEffect(() => {
    if (!selectedServer) return;
    setLoadingHistory(true);
    
    const getTimeRangeHours = (range: string) => {
      switch (range) {
        case '1h': return 1;
        case '24h': return 24;
        case '7d': return 24 * 7;
        case '30d': return 24 * 30;
        default: return 1;
      }
    };
    
    const hours = getTimeRangeHours(timeRange);
    const to = new Date().toISOString();
    const from = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    fetch(`/api/latency/history?serverId=${selectedServer}&from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((d) => {
        setHistory(d.history || []);
      })
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false));
  }, [selectedServer, timeRange]);

  if (!servers.length) return <Loader />;

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <button
              onClick={() => {
                setShowArcs(!showArcs);
                if (showTopology) setShowTopology(false);
              }}
              className={`px-3 py-1 rounded transition-colors ${
                showArcs && !showTopology
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Latency
            </button>
            <button
              onClick={() => {
                setShowTopology(!showTopology);
                if (showArcs) setShowArcs(false);
              }}
              className={`px-3 py-1 rounded transition-colors ${
                showTopology 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Topology
            </button>
            <button
              onClick={() => setShowRegions(!showRegions)}
              className={`px-3 py-1 rounded transition-colors ${
                showRegions 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Regions
            </button>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1 rounded transition-colors ${
                showHeatmap 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Heatmap
            </button>
          </div>
        </div>
        
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
          arcAltitude="arcAltitude"
          arcDashLength={2}
          arcDashGap={1}
          arcDashAnimateTime={4000}
          arcLabel="arcLabel"
          ringsData={rings}
          ringLat="lat"
          ringLng="lng"
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          ringColor="color"
          heatmapsData={[heatmapData]}
          heatmapPointLat="lat"
          heatmapPointLng="lng"
          heatmapPointWeight="weight"
          heatmapTopAltitude={0.02}
          heatmapBaseAltitude={0.01}
          width={globeSize.width}
          height={globeSize.height}
          enablePointerInteraction={true}
          animateIn={false}
        />
      </div>

      {/* Mobile/Desktop Responsive Side Panel */}
      {selectedServer && (
        <div className="w-full lg:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:max-h-[600px] lg:overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Server Details</h3>
            <button
              onClick={() => setSelectedServer(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Time Range</div>
            <div className="flex flex-wrap gap-2">
              {['1h', '24h', '7d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    timeRange === range
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {loadingHistory ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading history...</div>
            </div>
          ) : (
            <TimeSeriesChart data={history} serverId={selectedServer} timeRange={timeRange} />
          )}
        </div>
      )}
    </div>
  );
}
