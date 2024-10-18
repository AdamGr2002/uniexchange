"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadButton } from "@uploadthing/react"
import { OurFileRouter } from "../api/uploadthing/core"

export default function UploadPage() {
  const router = useRouter()
  const [fileUrl, setFileUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    formData.append('fileUrl', fileUrl)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      router.push("/")
    } else {
      console.error("Upload failed")
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Upload Course Material</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="file">File</Label>
          <UploadButton<OurFileRouter>
            endpoint="courseFile"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res)
              setFileUrl(res[0].url)
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`)
            }}
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="Enter material title" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Enter brief description" required />
        </div>
        <div>
          <Label htmlFor="university">University</Label>
          <Select name="university">
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
          <Label htmlFor="subject">Subject</Label>
          <Select name="subject">
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
          <Label htmlFor="year">Year of Study</Label>
          <Select name="year">
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
        <Button type="submit">Upload Material</Button>
      </form>
    </div>
  )
}