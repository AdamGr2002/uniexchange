"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Discussion {
  id: number
  user_id: string
  content: string
  created_at: string
  parent_id: number | null
}

export default function DiscussionList({ materialId }: { materialId: string }) {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchDiscussions()
    setupSSE()
  }, [])

  const fetchDiscussions = async () => {
    const response = await fetch(`/api/discussions?materialId=${materialId}&page=${page}`)
    const data = await response.json()
    setDiscussions(prev => [...prev, ...data.discussions])
    setHasMore(data.hasMore)
    setPage(prev => prev + 1)
  }

  const setupSSE = () => {
    const eventSource = new EventSource(`/api/sse?materialId=${materialId}`)
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'newDiscussion') {
        setDiscussions(prev => [data.data, ...prev])
      }
    }
    return () => eventSource.close()
  }

  const renderDiscussion = (discussion: Discussion) => (
    <li key={discussion.id} className="rounded-lg border p-4 mb-4">
      <div className="flex items-center justify-between">
        <span className="font-bold">User: {discussion.user_id}</span>
        <span className="text-sm text-muted-foreground">
          {new Date(discussion.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="mt-2">{discussion.content}</p>
      {discussion.parent_id === null && (
        <Button variant="link" onClick={() => handleReply(discussion.id)}>Reply</Button>
      )}
      {discussions.filter(d => d.parent_id === discussion.id).map(renderDiscussion)}
    </li>
  )

  const handleReply = (parentId: number) => {
    // Implement reply functionality here
    console.log(`Reply to discussion ${parentId}`)
  }

  return (
    <div>
      <ul className="space-y-4">
        {discussions.filter(d => d.parent_id === null).map(renderDiscussion)}
      </ul>
      {hasMore && (
        <Button onClick={fetchDiscussions} className="mt-4">Load More</Button>
      )}
    </div>
  )
}