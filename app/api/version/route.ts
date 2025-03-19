import { NextResponse } from 'next/server';

// This will be replaced with the actual build hash during deployment
const BUILD_VERSION = process.env.BUILD_ID || Date.now().toString();

export async function GET() {
  return NextResponse.json({ version: BUILD_VERSION });
} 