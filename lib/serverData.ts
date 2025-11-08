// lib/serverData.ts
import fs from 'fs';
import path from 'path';

export type ServerDef = {
  id: string;
  exchange: string;
  provider: string;
  regionCode: string;
  lat: number;
  lng: number;
  host: string;
  port: number;
};

export function loadServers(): ServerDef[] {
  const p = path.join(process.cwd(), 'public', 'data', 'servers.json');
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw) as ServerDef[];
}
