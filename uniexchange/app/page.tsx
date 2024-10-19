"use client"

import { useState, useEffect } from "react"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, Search, Upload, FileText, Folder } from "lucide-react"

interface Material {
  id: number
  title: string
  description: string
  university: string
  subject: string
  year: number
  created_at: string
}

export default function Home() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [university, setUniversity] = useState("")
  const [subject, setSubject] = useState("")
  const [year, setYear] = useState("")

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    const response = await fetch(`/api/materials?page=${page}`)
    const data = await response.json()
    setMaterials(prev => [...prev, ...data.materials])
    setHasMore(data.hasMore)
    setPage(prev => prev + 1)
  }

  const handleSearch = async () => {
    const params = new URLSearchParams({
      q: searchQuery,
      ...(university && { university }),
      ...(subject && { subject }),
      ...(year && { year })
    })
    const response = await fetch(`/api/search?${params}`)
    const data = await response.json()
    setMaterials(data)
    setHasMore(false)
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center space-x-4">
          <Book className="h-6 w-6" />
          <h1 className="text-2xl font-bold">UniExchange</h1>
        </div>
        <div className="flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r p-6">
          <nav className="space-y-6">
            <div>
              <label htmlFor="university" className="text-sm font-medium">University</label>
              <Select value={university} onValueChange={setUniversity}>
                <SelectTrigger id="university">
                  <SelectValue placeholder="Select University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tunis">University of Tunis</SelectItem>
                  <SelectItem value="sfax">University of Sfax</SelectItem>
                  <SelectItem value="sousse">University of Sousse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="medicine">Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="year" className="text-sm font-medium">Year of Study</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="relative flex-grow mr-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search materials..." 
                className="pl-8 pr-20" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                className="absolute right-0 top-0 bottom-0" 
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
            <Link href="/upload">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Material
              </Button>
            </Link>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <div key={material.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">{material.title}</span>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Folder className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    University: {material.university}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Subject: {material.subject}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Year: {material.year}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(material.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <Link href={`/material/${material.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <Button onClick={fetchMaterials} className="mt-4">Load More Materials</Button>
            )}
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}