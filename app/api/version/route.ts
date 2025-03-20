import { NextResponse } from 'next/server';

// Use the same version source as the layout
const BUILD_VERSION = process.env.VERCEL_GIT_COMMIT_SHA || 'development';

export async function GET() {
  // In development, always return the same version to prevent unnecessary updates
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json({ version: BUILD_VERSION });
  }
  
  return NextResponse.json({ version: BUILD_VERSION });
} 