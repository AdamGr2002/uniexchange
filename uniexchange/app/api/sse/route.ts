import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const materialId = searchParams.get('materialId')

  if (!materialId) {
    return NextResponse.json({ error: 'Material ID is required' }, { status: 400 })
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      const sendEvent = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }

      // Simulate sending events (in a real app, this would be triggered by database changes)
      const interval = setInterval(() => {
        sendEvent(JSON.stringify({ type: 'newDiscussion', data: { id: Date.now(), content: 'New discussion' } }))
      }, 5000)

      // Clean up on close
      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}