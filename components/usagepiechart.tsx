"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

const COLORS = ["#0ea5e9", "#14b8a6", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#22c55e", "#eab308", "#f43f5e", "#06b6d4"]

export type UsageDatum = { year: string; value: number }

export default function UsagePieChart({ data }: { data: UsageDatum[] }) {
  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="year"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
            isAnimationActive
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
