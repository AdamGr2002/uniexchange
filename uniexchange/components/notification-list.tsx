"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Notification {
  id: number
  type: string
  content: string
  related_id: number
  is_read: boolean
  created_at: string
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    const response = await fetch(`/api/notifications?page=${page}`)
    const data = await response.json()
    setNotifications(prev => [...prev, ...data.notifications])
    setHasMore(data.hasMore)
    setPage(prev => prev + 1)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li key={notification.id} className={`rounded-lg border p-4 ${notification.is_read ? 'bg-gray-100' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold">{notification.type}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(notification.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2">{notification.content}</p>
          </li>
        ))}
      </ul>
      {hasMore && (
        <Button onClick={fetchNotifications} className="mt-4">Load More Notifications</Button>
      )}
    </div>
  )
}