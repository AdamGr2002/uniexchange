"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Rating {
  id: number
  user_id: string
  rating: number
  comment: string
  created_at: string
}

export default function RatingList({ materialId }: { materialId: string }) {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchRatings()
  }, [])

  const fetchRatings = async () => {
    const response = await fetch(`/api/ratings?materialId=${materialId}&page=${page}`)
    const data = await response.json()
    setRatings(prev => [...prev, ...data.ratings])
    setHasMore(data.hasMore)
    setPage(prev => prev + 1)
  }

  return (
    <div>
      <ul className="space-y-4">
        {ratings.map((rating) => (
          <li key={rating.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold">Rating: {rating.rating}/5</span>
              <span className="text-sm text-muted-foreground">
                {new Date(rating.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2">{rating.comment}</p>
          </li>
        ))}
      </ul>
      {hasMore && (
        <Button onClick={fetchRatings} className="mt-4">Load More Ratings</Button>
      )}
    </div>
  )
}