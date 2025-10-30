"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { categoryBadgeClass, cardRingClass } from "../lib/category-styles"
import type { ResourceItem } from "@/lib/resources-data"

type Props = ResourceItem

export default function ResourceCard({
  id,
  title,
  excerpt,
  imageUrl,
  date,
  readTime,
  author,
  authorAvatar,
  category,
  featured,
  externalUrl,
}: Props) {
  const cardColors = cardRingClass[category] ?? "ring-cyan-100 hover:ring-cyan-200"
  const badgeColor = categoryBadgeClass[category] ?? "bg-cyan-600"

  return (
    <Link
      href={externalUrl ? externalUrl : `/resources/${id}`}
      target={externalUrl ? "_blank" : undefined}
      rel={externalUrl ? "noreferrer" : undefined}
      className={cn(
        "group block rounded-xl overflow-hidden bg-white shadow-sm ring-1 transition-all hover:shadow-md",
        "flex flex-col h-full", // 等高卡片
        cardColors
      )}
    >
      {/* 封面图 */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        {/* 分类徽章 */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className={cn(badgeColor, "text-white")}>{category}</Badge>
          {featured && <Badge className="bg-cyan-700/90 text-white">Featured</Badge>}
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex flex-col grow p-4 md:p-5">
        {/* 日期 / 阅读时长 / 链接 */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {date && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {date}
            </span>
          )}
          {readTime && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readTime}
            </span>
          )}
          {externalUrl && (
            <span className="inline-flex items-center gap-1 text-cyan-700">
              <ExternalLink className="h-4 w-4" />
              Link
            </span>
          )}
        </div>

        {/* 标题 */}
        <h3 className="font-serif text-xl font-bold leading-snug mb-2 group-hover:text-cyan-800 min-h-[3.2rem]">
          {title}
        </h3>

        {/* 摘要 */}
        {excerpt && <p className="text-gray-600 line-clamp-3 mb-4 min-h-[4.5rem]">{excerpt}</p>}

        {/* 作者信息（底部对齐） */}
        <div className="mt-auto flex items-center gap-3">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={authorAvatar || "/placeholder.svg"}
              alt={author || "Unknown Author"}
              width={32}
              height={32}
              className="h-8 w-8 object-cover"
            />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">{author || "Unknown Author"}</p>
            <p className="text-gray-500">
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
