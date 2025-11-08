// app/api/servers/route.ts
import { NextResponse } from 'next/server';
import { loadServers } from '../../../lib/serverData';

export async function GET() {
  const servers = loadServers();
  return NextResponse.json({ servers });
}
