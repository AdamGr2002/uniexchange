import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { openDb } from '@/lib/db'

export async function GET(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 10
  const offset = (page - 1) * limit

  const db = await openDb()
  const notifications = await db.all(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [userId, limit, offset]
  )

  const totalCount = await db.get('SELECT COUNT(*) as count FROM notifications WHERE user_id = ?', userId)
  const hasMore = totalCount.count > page * limit

  return NextResponse.json({ notifications, hasMore })
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type, content, relatedId } = await req.json()

  const db = await openDb()
  const result = await db.run(
    'INSERT INTO notifications (user_id, type, content, related_id) VALUES (?, ?, ?, ?)',
    [userId, type, content, relatedId]
  )

  return NextResponse.json({ success: true, id: result.lastID })
}