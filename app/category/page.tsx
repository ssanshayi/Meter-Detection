"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

type CategoryItem = {
  slug: string
  title: string
  summary: string
  image: string
  tag?: string
}

const CATEGORIES: CategoryItem[] = [
  { slug: "coal", title: "煤炭（Coal）", summary: "Traditional fossil fuels, as the main source of energy, have stable costs and reliable loads, but have high carbon emissions and pollutants, gradually facing pressure to reduce emissions and transform.", image: "/category/coal.png", tag: "fossil energy" },
  { slug: "electricity", title: "电力（Electricity）", summary: "The universal form of secondary energy, covering the entire chain of power generation, transmission and distribution, and consumption, is the fundamental energy form for modern industry and people's livelihood.", image: "/category/electric.png", tag: "secondary energy" },
  { slug: "natural-gas", title: "天然气（Natural Gas）", summary: "Compared to coal, fossil fuels that are cleaner are commonly used for peak shaving, heating, and chemical raw materials, but there are risks of methane leakage and geopolitical supply.", image: "/category/natural gas.png", tag: "fossil energy" },
  { slug: "solar", title: "太阳能（Solar）", summary: "One of the fastest growing renewable energy sources, with significantly reduced costs in recent years; Strong volatility, usually coordinated with energy storage/grid scheduling.", image: "/category/solar.png", tag: "renewable energy" },
]

function SafeImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false)
  return (
    <Image
      src={err ? "/placeholder.jpg" : src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setErr(true)}
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
    />
  )
}

export default function CategoryIndexPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-800">Energy Categories</h1>
        <p className="text-gray-600 mt-3 max-w-3xl mx-auto">
          Select an energy category to enter the details page and view information such as <strong>Intro/Usage/Benefits/Hazards</strong>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
        {CATEGORIES.map((c) => (
          <Card key={c.slug} className="overflow-hidden hover:shadow-lg transition flex flex-col h-full">
            <div className="relative h-40">
              <SafeImage src={c.image || "/placeholder.jpg"} alt={c.title} />
            </div>

            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">{c.title}</CardTitle>
                {c.tag ? <Badge variant="outline" className="shrink-0">{c.tag}</Badge> : null}
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 grow">
              <p className="text-sm text-gray-600">{c.summary}</p>
              <div className="mt-auto">
                <Button asChild>
                  <Link href={`/category/${c.slug}`}>View details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
