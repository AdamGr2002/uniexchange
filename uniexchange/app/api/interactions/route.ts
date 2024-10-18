import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { openDb } from '@/lib/db'

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { materialId, interactionType } = await req.json()

  if (!materialId || !interactionType) {
    return NextResponse.json({ error: 'Material ID and interaction type are required' }, { status: 400 })
  }

  const db = await openDb()
  await db.run(
    'INSERT INTO user_interactions (user_id, material_id, interaction_type) VALUES (?, ?, ?)',
    [userId, materialId, interactionType]
  )

  return NextResponse.json({ success: true })
}