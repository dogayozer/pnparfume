import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Legacy upload route disabled. Please use /api/admin/sync' });
}
