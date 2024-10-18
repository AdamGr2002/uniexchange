import { NextResponse } from 'next/server'
import { searchMaterials } from '@/lib/elasticsearch'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const university = searchParams.get('university')
  const subject = searchParams.get('subject')
  const year = searchParams.get('year')

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  const filters: { [key: string]: string | number } = {}
  if (university) filters['university'] = university
  if (subject) filters['subject'] = subject
  if (year) filters['year'] = parseInt(year)

  const results = await searchMaterials(query, filters)

  return NextResponse.json(results)
}