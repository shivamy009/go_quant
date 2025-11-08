// lib/fetchLatency.ts
import net from 'net';

export async function tcpConnectLatency(host: string, port = 443, timeoutMs = 3000): Promise<number> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const socket = new net.Socket();
    let done = false;

    const cleanup = () => {
      if (!done) {
        done = true;
        socket.destroy();
      }
    };

    socket.setTimeout(timeoutMs, () => {
      cleanup();
      reject(new Error('timeout'));
    });

    socket.once('error', (err) => {
      cleanup();
      reject(err);
    });

    socket.connect(port, host, () => {
      const rtt = Date.now() - start;
      cleanup();
      resolve(rtt);
    });
  });
}
