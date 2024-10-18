import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { openDb } from "@/lib/db"
import DiscussionForm from "./discussion-form"
import RatingForm from "./rating-form"
import DiscussionList from "./discussion-list"
import RatingList from "./rating-list"

async function getMaterial(id: string) {
  const db = await openDb()
  return db.get('SELECT * FROM materials WHERE id = ?', id)
}

export default async function MaterialPage({ params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")

  const material = await getMaterial(params.id)

  if (!material) {
    return <div>Material not found</div>
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="mb-4 text-3xl font-bold">{material.title}</h1>
      <p className="mb-4 text-lg">{material.description}</p>
      <div className="mb-4">
        <p><strong>University:</strong> {material.university}</p>
        <p><strong>Subject:</strong> {material.subject}</p>
        <p><strong>Year:</strong> {material.year}</p>
        <p><strong>Uploaded on:</strong> {new Date(material.created_at).toLocaleDateString()}</p>
      </div>
      <Button asChild>
        <Link href={material.file_path}>Download Material</Link>
      </Button>

      <h2 className="mt-8 mb-4 text-2xl font-bold">Ratings and Reviews</h2>
      <RatingList materialId={params.id} />
      <RatingForm materialId={params.id} />

      <h2 className="mt-8 mb-4 text-2xl font-bold">Discussion Forum</h2>
      <DiscussionList materialId={params.id} />
      <DiscussionForm materialId={params.id} />
    </div>
  )
}