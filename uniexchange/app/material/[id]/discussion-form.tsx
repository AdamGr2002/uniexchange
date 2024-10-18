"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function DiscussionForm({ materialId }: { materialId: string }) {
  const [content, setContent] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/discussions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ materialId, content }),
    })

    if (response.ok) {
      setContent("")
      // You might want to add some state management here to update the list of discussions
    } else {
      console.error("Failed to post discussion")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add to the discussion..."
        required
      />
      <Button type="submit" className="mt-2">Post</Button>
    </form>
  )
}