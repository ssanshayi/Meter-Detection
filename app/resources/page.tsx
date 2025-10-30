"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, BookOpen, Newspaper, Lightbulb, X, Loader2 } from "lucide-react"
import { resourcesData, type ResourceCategory, type ResourceItem } from "@/lib/resources-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ResourceCard from "@/components/resource-card"
import type { JSX } from "react"
import { supabase } from "@/lib/supabase"

const CATEGORIES: ResourceCategory[] = ["All", "Research", "News", "Innovation"]

// 图标
const categoryIcons: Record<Exclude<ResourceCategory, "All">, JSX.Element> = {
  Research: <BookOpen className="mr-2 h-4 w-4" />,
  News: <Newspaper className="mr-2 h-4 w-4" />,
  Innovation: <Lightbulb className="mr-2 h-4 w-4" />,
}

// 固定颜色映射
const categoryButtonClasses: Record<ResourceCategory, { active: string; inactive: string }> = {
  All: {
    active: "bg-cyan-600 hover:bg-cyan-700 text-white",
    inactive: "",
  },
  Research: {
    active: "bg-blue-600 hover:bg-blue-700 text-white",
    inactive: "text-blue-600 border-blue-200",
  },
  News: {
    active: "bg-emerald-600 hover:bg-emerald-700 text-white",
    inactive: "text-emerald-600 border-emerald-200",
  },
  Innovation: {
    active: "bg-amber-600 hover:bg-amber-700 text-white",
    inactive: "text-amber-600 border-amber-200",
  },
}

export default function ResourcesPage() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>("All")
  const [resources, setResources] = useState<ResourceItem[]>(resourcesData)

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase.from("new_resources").select("*")
      if (error) throw error

      if (data) {
        setResources(
          data.map((r: any) => ({
            id: String(r.id),
            title: r.title,
            excerpt: r.excerpt ?? "",
            category: r.category as ResourceItem["category"],
            date: r.date ?? "",
            imageUrl: r.image_url ?? undefined,
            author: r.author ?? "",
            authorAvatar: r.author_avatar ?? undefined,
            authorRole: r.author_role ?? undefined,
            readTime: r.read_time ?? undefined,
            featured: r.featured === true || r.featured === "true",
            externalUrl: r.external_url ?? undefined,
          }))
        )
      }
    } catch {
      setResources(resourcesData)
    } finally {
      setLoading(false)
    }
  }

  // 初次加载 + 实时监听
  useEffect(() => {
    fetchResources()
    const channel = supabase
      .channel("new-resources-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "new_resources" },
        () => fetchResources()
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const featuredResources = useMemo(() => resources.filter((r) => r.featured), [resources])

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        q === "" ||
        r.title.toLowerCase().includes(q) ||
        r.excerpt.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q)
      const matchesCategory = selectedCategory === "All" || r.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [resources, searchQuery, selectedCategory])

  const displayedResources = useMemo(() => {
    return filteredResources.filter(
      (r) => !(!searchQuery && selectedCategory === "All" && r.featured)
    )
  }, [filteredResources, searchQuery, selectedCategory])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-cyan-800 to-teal-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Energy Resources</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Explore curated research, news, and innovations across the energy ecosystem —
              from power systems and grids to storage, renewables, and decarbonization.
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" size={20} />
              <Input
                placeholder="Search for energy resources..."
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Main */}
      <section className="container mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat
              const classes = isActive
                ? categoryButtonClasses[cat].active
                : `border ${categoryButtonClasses[cat].inactive}`
              return (
                <Button
                  key={cat}
                  variant={isActive ? "default" : "outline"}
                  className={`rounded-full ${classes}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat !== "All" && categoryIcons[cat as Exclude<ResourceCategory, "All">]}
                  {cat === "All" ? "All Resources" : cat}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-cyan-700" />
              <p>Loading resources...</p>
            </div>
          </div>
        ) : (
          <>
            {!searchQuery && selectedCategory === "All" && featuredResources.length > 0 && (
              <div className="mb-12">
                <h2 className="font-serif text-2xl font-bold mb-6">Featured Resources</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {featuredResources.map((r) => (
                    <ResourceCard key={r.id} {...r} />
                  ))}
                </div>
              </div>
            )}

            {displayedResources.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">
                  No resources found matching your search criteria.
                </p>
                <Button onClick={() => setSearchQuery("")}>Clear search</Button>
              </div>
            ) : (
              <div>
                <h2 className="font-serif text-2xl font-bold mb-6">
                  {searchQuery
                    ? "Search Results"
                    : selectedCategory === "All"
                    ? "All Resources"
                    : `${selectedCategory} Resources`}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {displayedResources.map((r) => (
                    <ResourceCard key={r.id} {...r} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
