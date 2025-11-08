// app/api/latency/history/route.ts
import { NextResponse } from 'next/server';
import { getWorker } from '../../../../lib/latencyWorker';

export async function GET(req: Request) {
  const worker = getWorker();
  const url = new URL(req.url);
  const serverId = url.searchParams.get('serverId');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  if (!serverId) {
    return NextResponse.json({ error: 'serverId required' }, { status: 400 });
  }
  const history = worker.history[serverId] || [];
  const filtered = history.filter((s) => {
    const t = new Date(s.timestamp).getTime();
    return (!from || t >= new Date(from).getTime()) && (!to || t <= new Date(to).getTime());
  });
  return NextResponse.json({ serverId, history: filtered });
}
