"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import NewsCard from "@/components/news-card"
import ConservationStats from "@/components/energy-stats"
import UploadForm from "@/components/uploadform"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import MeterDetectionInline from "../components/meter-detection-inline"
import { ArrowRight, Compass, Search, BarChart3, BookOpen, Users, Globe, Mail } from "lucide-react"


export default function Home() {
  // State for resources
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [species, setSpecies] = useState<any[]>([])
  const [speciesLoading, setSpeciesLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("new_resources").select("*")
        if (error) throw error
        if (data) {
          setResources(
            data.map((r: any) => ({
              ...r,
              imageUrl: r.image_url,
              authorAvatar: r.author_avatar,
              readTime: r.read_time,
            }))
          )
        }
      } catch (err) {
        setResources([])
      } finally {
        setLoading(false)
      }
    }
    const fetchSpecies = async () => {
      setSpeciesLoading(true)
      try {
        const { data, error } = await supabase.from("marine_species").select("*")
        if (error) throw error
        if (data) {
          setSpecies(data)
        }
      } catch (err) {
        setSpecies([])
      } finally {
        setSpeciesLoading(false)
      }
    }
    fetchResources()
    fetchSpecies()
    // Fetch user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  // Handler for protected actions
  const handleProtectedAction = (href: string) => (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      toast({
        title: "Authentication Required",
        description: "Please sign in or log in to use this feature.",
      })
    } else {
      router.push(href)
    }
  }

  // Helper to get latest N resources by category
  const getLatestByCategory = (category: string, n: number) => {
    return resources
      .filter((r) => r.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, n)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/haojia-building.png"
            alt="Haojia Energy Building"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-32 text-white">
          {/* 品牌标题 */}
          <h1 className="text-4xl md:text-6xl font-bold mb-1">昊甲能源</h1>
          <p className="text-base md:text-lg text-white/80 mb-6">Haojia Energy</p>

          {/* 英文欢迎语描述 */}
          <p className="text-lg md:text-xl mb-8 max-w-3xl">
            Welcome to HAOJIA Energy Web. Explore energy analytics, AI-powered meter detection, and data-driven insights.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700">
              <a href="/meter-detection" onClick={handleProtectedAction("/meter-detection")}>
                Start Meter Detection <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent text-white border-white hover:bg-white/20"
            >
              <Link href="#about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
<section id="about" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-800">About Our Platform</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Haojia Energy provides a unified platform for energy data management, AI meter reading, and insight
        dashboards—helping utilities and enterprises digitize operations, reduce costs, and improve reliability.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <Card>
        <CardHeader>
          <Compass className="h-10 w-10 text-cyan-600 mb-2" />
          <CardTitle>Real-time Meter Scanning</CardTitle>
          <CardDescription>Instant OCR & anomaly flags</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Upload images/videos and get meter readings instantly. Track read history and highlight outliers for
            QA review.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Search className="h-10 w-10 text-cyan-600 mb-2" />
          <CardTitle>Resource Discovery</CardTitle>
          <CardDescription>Data assets & energy datasets</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Discover structured datasets, annotated samples, and visual references to support AI model training
            and system optimization.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <BarChart3 className="h-10 w-10 text-cyan-600 mb-2" />
          <CardTitle>Energy Analytics</CardTitle>
          <CardDescription>Trends, peaks & forecasts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Visualize usage patterns, detect seasonal peaks, and build demand forecasts to optimize operations.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</section>


      {/* Energy Impact / Stats Section（暂用现有组件） */}
      <section className="py-20 bg-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-800">Energy Comsuption</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tracking the usage rate of different energy sources.
            </p>
          </div>

          <ConservationStats />
        </div>
      </section>

      {/* Resource Discovery Section */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-800">Resource Discovery</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
      Explore and understand different energy sources, grasp the latest trends, research trends, and innovative directions in the industry.
      </p>
    </div>

    <Tabs defaultValue="research" className="w-full mb-8">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
        <TabsTrigger value="research">Research</TabsTrigger>
        <TabsTrigger value="news">News</TabsTrigger>
        <TabsTrigger value="innovation">Innovation</TabsTrigger>
      </TabsList>

      <TabsContent value="research" className="mt-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {getLatestByCategory("Research", 3).map((r) => (
              <NewsCard
                key={r.id}
                title={r.title}
                date={r.date}
                category={r.category}
                excerpt={r.excerpt}
                imageUrl={r.imageUrl}
                link={`/resources/${r.id}`}
                onClick={handleProtectedAction(`/resources/${r.id}`)}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="news" className="mt-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {getLatestByCategory("News", 3).map((r) => (
              <NewsCard
                key={r.id}
                title={r.title}
                date={r.date}
                category={r.category}
                excerpt={r.excerpt}
                imageUrl={r.imageUrl}
                link={`/resources/${r.id}`}
                onClick={handleProtectedAction(`/resources/${r.id}`)}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="innovation" className="mt-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {getLatestByCategory("Innovation", 3).map((r) => (
              <NewsCard
                key={r.id}
                title={r.title}
                date={r.date}
                category={r.category}
                excerpt={r.excerpt}
                imageUrl={r.imageUrl}
                link={`/resources/${r.id}`}
                onClick={handleProtectedAction(`/resources/${r.id}`)}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>

    <div className="text-center mt-8">
      <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
        <Link href="/resources">view all resources</Link>
      </Button>
    </div>
  </div>
</section>

      {/* AI Meter Detection Upload Section */}
      <section id="ai-detection" className="py-20 bg-gray-50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-800">AI Meter Detection</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
      Upload a picture of the electricity meter, and the YOLOv8 model will automatically recognize the numbers and return the recognized picture along with the numerical values.
      </p>
    </div>
    <MeterDetectionInline />
  </div>
</section>
    </div>
  )
}

// Helper function to get badge color based on conservation status
function getStatusBadgeColor(status: string) {
  if (status?.includes("Critically Endangered")) return "bg-red-500 text-white"
  if (status?.includes("Endangered")) return "bg-orange-500 text-white"
  if (status?.includes("Vulnerable")) return "bg-yellow-500 text-white"
  if (status?.includes("Near Threatened")) return "bg-blue-500 text-white"
  if (status?.includes("Least Concern")) return "bg-green-500 text-white"
  return "bg-gray-500 text-white"
}

// Helper to shuffle an array
function shuffleArray(array: any[]) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
