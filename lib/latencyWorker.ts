// lib/latencyWorker.ts
import { loadServers, type ServerDef } from './serverData';
import { tcpConnectLatency } from './fetchLatency';
import { latencyColor, nowIso } from './utils';
import { startAtlasStream, createPingMeasurement } from './ripeAtlasWorker';

export type LatencySample = {
  id: string;
  host: string;
  port: number;
  timestamp: string;
  rttMs: number | null;
  status: 'ok' | 'timeout' | 'error';
};

type WorkerState = {
  servers: ServerDef[];
  latest: Record<string, LatencySample>;
  history: Record<string, LatencySample[]>;
  intervalMs: number;
  running: boolean;
};

declare global {
  var __latencyWorker__: WorkerState | undefined;
}

function makeInitialState(): WorkerState {
  const servers = loadServers();
  return {
    servers,
    latest: {},
    history: {},
    intervalMs: 5000,
    running: false
  };
}

export function getWorker(): WorkerState {
  if (!global.__latencyWorker__) {
    global.__latencyWorker__ = makeInitialState();
    startWorker(global.__latencyWorker__).catch((e) => console.error('worker start failed', e));
  }
  return global.__latencyWorker__!;
}

async function startWorker(state: WorkerState) {
  if (state.running) return;
  state.running = true;

  const apiKey = process.env.RIPE_ATLAS_KEY;

  // If RIPE key exists, try to start stream (best-effort)
  if (apiKey) {
    try {
      // optionally create measurements for each host (be careful with quotas)
      // For demo we skip creation to avoid quota abuse; assume streaming provides results from public measurements.
      startAtlasStream((payload) => {
        // payload structure: { type: 'ping', result: { rtt, target, ... } } - adapt as needed
        // We try to detect rtt and target.
        try {
          const { measurement_id, result, target, timestamp } = payload;
          // result might be array; rtt in result.rtt etc.
          const host = target;
          const rtt = result && result.rtt ? result.rtt : null;
          // find matching server (by host substring)
          const s = state.servers.find((sv) => host && host.includes(sv.host));
          if (s) {
            const sample = {
              id: s.id,
              host: s.host,
              port: s.port,
              timestamp: nowIso(),
              rttMs: typeof rtt === 'number' ? Math.round(rtt) : null,
              status: typeof rtt === 'number' ? 'ok' : 'error'
            } as LatencySample;
            state.latest[s.id] = sample;
            state.history[s.id] = state.history[s.id] || [];
            state.history[s.id].push(sample);
            if (state.history[s.id].length > 2000) state.history[s.id].shift();
          }
        } catch (e) {
          // ignore
        }
      });
      console.info('RIPE Atlas stream started (best-effort).');
    } catch (e) {
      console.warn('RIPE Atlas stream failed to start:', e);
    }
  }

  // Fallback poller (TCP connect measurements) — runs regardless of RIPE streaming to ensure local measurements available
  async function pollOnce() {
    const now = nowIso();
    await Promise.all(
      state.servers.map(async (s) => {
        try {
          const rtt = await tcpConnectLatency(s.host, s.port, 4000);
          const sample: LatencySample = {
            id: s.id,
            host: s.host,
            port: s.port,
            timestamp: now,
            rttMs: rtt,
            status: 'ok'
          };
          state.latest[s.id] = sample;
          state.history[s.id] = state.history[s.id] || [];
          state.history[s.id].push(sample);
          if (state.history[s.id].length > 2000) state.history[s.id].shift();
        } catch (err: any) {
          const sample: LatencySample = {
            id: s.id,
            host: s.host,
            port: s.port,
            timestamp: now,
            rttMs: null,
            status: err?.message === 'timeout' ? 'timeout' : 'error'
          };
          state.latest[s.id] = sample;
          state.history[s.id] = state.history[s.id] || [];
          state.history[s.id].push(sample);
          if (state.history[s.id].length > 2000) state.history[s.id].shift();
        }
      })
    );
  }

  // initial immediate poll
  await pollOnce();

  // schedule repeated polls
  setInterval(() => {
    pollOnce().catch((e) => console.error('poll error', e));
  }, state.intervalMs);
}
