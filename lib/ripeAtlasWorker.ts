// lib/ripeAtlasWorker.ts
import fetch from 'node-fetch';
import WebSocket from 'ws';
import { nowIso } from './utils';

type RipeResult = any;
const ATLAS_BASE = 'https://atlas.ripe.net/api/v2/';

export async function createPingMeasurement(apiKey: string, target: string) {
  const body = {
    definitions: [
      {
        target,
        description: `ping to ${target} (created by latency-visualizer)`,
        type: 'ping',
        af: 4
      }
    ],
    probes: [
      {
        requested: 2,
        type: 'area',
        value: 'WW'
      }
    ],
    is_oneoff: false,
    interval: 60
  };

  const res = await fetch(ATLAS_BASE + 'measurements/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error('Failed to create measurement: ' + t);
  }
  const data = await res.json();
  // data.measurements is array of created measurement ids
  return data;
}

export function startAtlasStream(onResult: (payload: any) => void) {
  // Connect to atlas-stream WebSocket (no auth for basic streaming)
  // See: https://atlas.ripe.net/docs/apis/streaming-api/
  // This is a best-effort connection; payloads will be many different types.
  const ws = new WebSocket('wss://atlas-stream.ripe.net/stream/?client=latency-visualizer');

  ws.on('open', () => {
    // subscribe to results
    ws.send(JSON.stringify(['atlas_subscribe', { streamType: 'result' }]));
  });

  ws.on('message', (msg) => {
    try {
      const parsed = JSON.parse(msg.toString());
      // parsed is like [type, payload]
      const [type, payload] = parsed;
      if (type === 'result') {
        onResult(payload);
      }
    } catch (e) {
      // ignore parse errors
    }
  });

  ws.on('error', (err) => {
    console.error('RIPE WS error', err);
  });

  return ws;
}
