// lib/utils.ts
export function latencyColor(rtt: number | null) {
  if (rtt === null) return '#888888';
  if (rtt < 50) return '#00ff7f';
  if (rtt < 150) return '#ffeb3b';
  return '#ff4d4f';
}

export function nowIso() {
  return new Date().toISOString();
}
