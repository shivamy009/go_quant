// app/api/latency/stream/route.ts
import { NextResponse } from 'next/server';
import { getWorker } from '../../../../lib/latencyWorker';

export async function GET(req: Request) {
  const worker = getWorker();

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    // CORS (adjust origin in production)
    'Access-Control-Allow-Origin': '*'
  });

  function send(data: any) {
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  }

  // send initial snapshot
  send({ timestamp: new Date().toISOString(), latest: worker.latest, servers: worker.servers });

  // every worker.intervalMs send update (simple implementation)
  const interval = setInterval(() => {
    send({ timestamp: new Date().toISOString(), latest: worker.latest });
  }, worker.intervalMs);

  // clean up when client disconnects
  try {
    (req as any).signal.addEventListener('abort', () => {
      clearInterval(interval);
      writer.close();
    });
  } catch (e) {
    // some runtimes don't support req.signal
  }

  return new NextResponse(readable, { status: 200, headers });
}
