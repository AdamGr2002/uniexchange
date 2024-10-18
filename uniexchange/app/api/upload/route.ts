import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { openDb } from '@/lib/db'
import { indexMaterial } from '@/lib/elasticsearch'

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const fileUrl = formData.get('fileUrl') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const university = formData.get('university') as string
  const subject = formData.get('subject') as string
  const year = parseInt(formData.get('year') as string, 10)

  const db = await openDb()
  const result = await db.run(
    `INSERT INTO materials (title, description, file_path, university, subject, year, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, fileUrl, university, subject, year, userId]
  )

  const materialId = result.lastID

  const material = {
    id: materialId,
    title,
    description,
    file_path: fileUrl,
    university,
    subject,
    year: isNaN(year) ? 0 : year,
    user_id: userId,
    created_at: new Date().toISOString()
  }

  await indexMaterial(material)

  return NextResponse.json({ success: true, id: materialId })
}