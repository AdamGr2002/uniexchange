import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { openDb } from '@/lib/db'

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { materialId, rating, comment } = await req.json()

  if (!materialId || !rating || !comment) {
    return NextResponse.json({ error: 'Material ID, rating, and comment are required' }, { status: 400 })
  }

  const db = await openDb()
  const result = await db.run(
    'INSERT INTO ratings (material_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
    [materialId, userId, rating, comment]
  )

  return NextResponse.json({ success: true, id: result.lastID })
}