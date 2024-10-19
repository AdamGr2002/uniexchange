import { NextResponse } from 'next/server'
import { searchMaterials } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const university = searchParams.get('university')
  const subject = searchParams.get('subject')
  const year = searchParams.get('year')

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  const filters = {
    ...(university && { university }),
    ...(subject && { subject }),
    ...(year && { year })
  }

  const results = await searchMaterials(query, filters)

  return NextResponse.json(results)
}