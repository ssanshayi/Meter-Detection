"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, ExternalLink } from "lucide-react"
import { resourcesData } from "@/lib/resources-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>()
  const [resource, setResource] = useState<any>(null)
  const [relatedResources, setRelatedResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Research":
        return "bg-blue-600 hover:bg-blue-700"
      case "News":
        return "bg-emerald-600 hover:bg-emerald-700"
      case "Innovation":
        return "bg-amber-600 hover:bg-amber-700"
      default:
        return "bg-cyan-700 hover:bg-cyan-800"
    }
  }

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true)
      let found: any = null
      try {
        const { data } = await supabase
          .from("new_resources")
          .select("*")
          .eq("id", params.id)
          .maybeSingle()

        if (data) {
          found = {
            ...data,
            featured: data.featured === true || data.featured === "true",
            imageUrl: data.image_url,
            authorAvatar: data.author_avatar,
            readTime: data.read_time,
          }
        }
      } catch {
        // ignore
      }

      if (!found) {
        const fallback = resourcesData.find((r) => r.id === params.id)
        if (fallback) found = fallback
      }

      let related: any[] = []
      if (found) {
        related = resourcesData
          .filter((r) => r.category === found.category && String(r.id) !== String(found.id))
          .slice(0, 3)
      }

      setResource(found || null)
      setRelatedResources(related || [])
      setLoading(false)
    }

    fetchResource()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  if (!loading && !resource) notFound()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-cyan-700" />
          <h2 className="text-xl font-serif font-bold mb-2">Loading Resource</h2>
          <p className="text-gray-500">Please wait while we prepare this content for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back */}
        <div className="mb-6">
          <Link href="/resources" className="text-cyan-700 hover:underline flex items-center gap-1">
            <ArrowLeft size={16} />
            <span>Back to Resources</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-[300px] md:h-[400px]">
                <Image
                  src={resource.imageUrl || "/placeholder.svg"}
                  alt={resource.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 right-4">
                  <Badge className={`${getCategoryColor(resource.category)} text-white`}>
                    {resource.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{resource.date}</span>
                  </div>
                  {resource.readTime && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{resource.readTime}</span>
                    </div>
                  )}
                </div>

                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {resource.title}
                </h1>

                <div className="flex items-center mb-6">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={resource.authorAvatar || "/placeholder.svg"} alt={resource.author} />
                    <AvatarFallback>{(resource.author || "?").charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{resource.author}</p>
                    <p className="text-sm text-gray-500">
                      {resource.category === "Research" ? "Research" : resource.category}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="prose max-w-none">
                  <p className="text-lg mb-4">{resource.excerpt}</p>
                  {/* 这里你之后可以替换为真实正文 */}
                  <p className="mb-4">
                    This is a placeholder body. Replace with your full content from Supabase (e.g.,
                    a rich text field) to render detailed energy insights, methods, and results.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                  <Button variant="outline" className="gap-1">
                    <Bookmark size={16} /> Save
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <Share2 size={16} /> Share
                  </Button>
                  {resource.external_url && (
                    <Button asChild variant="outline" className="gap-1">
                      <a href={resource.external_url} target="_blank" rel="noreferrer">
                        <ExternalLink size={16} /> Open Link
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="font-serif text-xl font-bold mb-4">Related Resources</h2>
              <div className="space-y-4">
                {relatedResources.length > 0 ? (
                  relatedResources.map((rel) => (
                    <div key={rel.id} className="flex gap-3">
                      <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                        <Image src={rel.imageUrl || "/placeholder.svg"} alt={rel.title} fill className="object-cover" />
                      </div>
                      <div>
                        <Badge className={`${getCategoryColor(rel.category)} text-white mb-1}`}>
                          {rel.category}
                        </Badge>
                        <h3 className="font-medium line-clamp-2 mb-1">
                          <Link href={`/resources/${rel.id}`} className="hover:text-cyan-700">
                            {rel.title}
                          </Link>
                        </h3>
                        {rel.readTime && <p className="text-sm text-gray-500">{rel.readTime}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No related resources found.</p>
                )}
              </div>

              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/resources">View All Resources</Link>
              </Button>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-serif text-xl font-bold mb-4">Resource Categories</h2>
              <div className="space-y-2">
                {[
                  { name: "Research", color: "bg-blue-600" },
                  { name: "News", color: "bg-emerald-600" },
                  { name: "Innovation", color: "bg-amber-600" },
                ].map((c) => (
                  <Link
                    key={c.name}
                    href={`/resources?category=${c.name}`}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center">
                      <Badge className={`${c.color} mr-2`}>
                        <span className="sr-only">{c.name}</span>
                      </Badge>
                      <span>{c.name}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {resourcesData.filter((r) => r.category === c.name).length}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
