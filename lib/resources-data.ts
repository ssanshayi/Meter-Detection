// lib/resources-data.ts
export type ResourceCategory = "All" | "Research" | "News" | "Innovation"

export type ResourceItem = {
  id: string
  title: string
  excerpt: string
  category: Exclude<ResourceCategory, "All">
  date: string
  imageUrl?: string
  author: string
  authorAvatar?: string
  readTime?: string
  featured?: boolean
  externalUrl?: string
}

export const resourcesData: ResourceItem[] = [
  {
    id: "e1",
    title: "Next-Gen Solid-State Batteries Reach Pilot Scale",
    excerpt:
      "A new pilot line demonstrates improved energy density and safety, marking a step toward commercialization.",
    category: "Innovation",
    date: "2025-05-12",
    imageUrl: "/images/energy/solid-state.jpg",
    author: "Dr. Lin Zhao",
    authorAvatar: "/images/authors/linzhao.jpg",
    readTime: "6 min read",
    featured: true,
  },
  {
    id: "e2",
    title: "IEA 2025: Global Energy Investment Outlook",
    excerpt:
      "Investment into clean power surges while grid bottlenecks remain a major constraint across regions.",
    category: "Research",
    date: "2025-06-02",
    imageUrl: "/images/energy/iea-outlook.jpg",
    author: "IEA Analytics Team",
    authorAvatar: "/images/authors/iea.jpg",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: "e3",
    title: "EU Announces New Grid Modernization Plan",
    excerpt:
      "Policy package targets permitting, interconnectors, and flexibility markets to accelerate RES integration.",
    category: "News",
    date: "2025-06-18",
    imageUrl: "/images/energy/eu-grid.jpg",
    author: "Energy Desk",
    authorAvatar: "/images/authors/newsdesk.jpg",
    readTime: "4 min read",
    featured: true,
  },
]
