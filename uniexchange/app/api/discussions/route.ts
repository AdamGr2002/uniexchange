import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { openDb } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const materialId = searchParams.get('materialId')

  if (!materialId) {
    return NextResponse.json({ error: 'Material ID is required' }, { status: 400 })
  }

  const db = await openDb()
  const discussions = await db.all('SELECT * FROM discussions WHERE material_id = ? ORDER BY created_at DESC', materialId)

  return NextResponse.json(discussions)
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { materialId, content } = await req.json()

  if (!materialId || !content) {
    return NextResponse.json({ error: 'Material ID and content are required' }, { status: 400 })
  }

  const db = await openDb()
  const result = await db.run(
    'INSERT INTO discussions (material_id, user_id, content) VALUES (?, ?, ?)',
    [materialId, userId, content]
  )

  return NextResponse.json({ success: true, id: result.lastID })
}