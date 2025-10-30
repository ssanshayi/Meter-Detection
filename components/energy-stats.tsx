"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

type Slice = { name: string; value: number }

const DEFAULT_DATA: Slice[] = [
  { name: "Renewables", value: 35 },
  { name: "Coal", value: 30 },
  { name: "Natural Gas", value: 20 },
  { name: "Nuclear", value: 10 },
  { name: "Oil", value: 5 },
]

const COLORS = ["#10b981", "#f59e0b", "#60a5fa", "#a78bfa", "#ef4444"]

export default function EnergyStats({
  data = DEFAULT_DATA,
  title = "Global Energy Comsuption",
  subtitle = "The utilization rate of different energy sources",
}: {
  data?: Slice[]
  title?: string
  subtitle?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={140}
              label={({ name, value }) => `${name}: ${value}%`}
              isAnimationActive
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
