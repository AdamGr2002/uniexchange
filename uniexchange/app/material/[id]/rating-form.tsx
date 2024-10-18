"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RatingForm({ materialId }: { materialId: string }) {
  const [rating, setRating] = useState("")
  const [comment, setComment] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ materialId, rating: parseInt(rating), comment }),
    })

    if (response.ok) {
      setRating("")
      setComment("")
      // You might want to add some state management here to update the list of ratings
    } else {
      console.error("Failed to submit rating")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
        <Select value={rating} onValueChange={setRating}>
          <SelectTrigger id="rating">
            <SelectValue placeholder="Select a rating" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value} Star{value !== 1 ? 's' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your review..."
          required
        />
      </div>
      <Button type="submit">Submit Rating</Button>
    </form>
  )
}