// app/api/latency/route.ts
import { NextResponse } from 'next/server';
import { getWorker } from '../../../lib/latencyWorker';

export async function GET() {
  const worker = getWorker();
  return NextResponse.json({
    servers: worker.servers,
    latest: worker.latest
  });
}
