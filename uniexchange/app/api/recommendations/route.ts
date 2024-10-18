/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getRecommendations } from '@/lib/recommendations'

export async function GET(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ 
      error: 'Unauthorized'
    }, {
      status: 401
    })
  }

  const recommendations = await getRecommendations(userId)

  return NextResponse.json(recommendations)
}