import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { openDb } from '@/lib/db'

export async function GET(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const university = searchParams.get('university')
  const subject = searchParams.get('subject')
  const year = searchParams.get('year')

  const db = await openDb()
  let query = 'SELECT * FROM materials WHERE 1=1'
  const params = []

  if (university) {
    query += ' AND university = ?'
    params.push(university)
  }
  if (subject) {
    query += ' AND subject = ?'
    params.push(subject)
  }
  if (year) {
    query += ' AND year = ?'
    params.push(year)
  }

  const materials = await db.all(query, params)

  return NextResponse.json(materials)
}