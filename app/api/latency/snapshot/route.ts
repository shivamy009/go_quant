import { NextResponse } from 'next/server';
import { getWorker } from '../../../../lib/latencyWorker';

export async function GET() {
  const worker = getWorker();
  return NextResponse.json({ timestamp: new Date().toISOString(), latest: worker.latest, servers: worker.servers });
}
