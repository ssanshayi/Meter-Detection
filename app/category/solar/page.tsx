"use client"

import Link from "next/link"
import UsagePieChart, { UsageDatum } from "@/components/usagepiechart"

const usage10y: UsageDatum[] = [
  { year: "2015", value: 1.5 },
  { year: "2016", value: 2.0 },
  { year: "2017", value: 2.6 },
  { year: "2018", value: 3.2 },
  { year: "2019", value: 3.9 },
  { year: "2020", value: 4.7 },
  { year: "2021", value: 5.8 },
  { year: "2022", value: 7.2 },
  { year: "2023", value: 8.8 },
  { year: "2024", value: 10.5 },
]

export default function SolarPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-800">
          Solar — Professional Overview
        </h1>
        <Link
          href="/category"
          className="inline-flex items-center gap-2 bg-cyan-700 text-white font-medium px-6 py-2 rounded-md shadow-md hover:bg-cyan-800 transition"
        >
          ← Back to Categories
        </Link>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Advantages</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Zero fuel cost with rapid LCOE decline.</li>
          <li>Scalable from rooftops to utility-scale plants.</li>
          <li>Short lead time and modular design.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Disadvantages</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Intermittent generation requires storage or backup.</li>
          <li>Land-use and grid integration constraints.</li>
          <li>Manufacturing and end-of-life recycling issues.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Usage Frequency (10-Year Share)</h2>
        <UsagePieChart data={usage10y} />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Price</h2>
        <p className="text-gray-700">
          Solar LCOE dropped from <strong>$80–$100/MWh</strong> to <strong>$25–$50/MWh</strong> within a decade.
          Module costs have declined by over 80%, driven by technological improvements and economies of scale.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Summary</h2>
        <p className="text-gray-700 leading-7">
          Solar’s global share increased from <strong>1.5%</strong> to <strong>10.5%</strong> in ten years,
          becoming the fastest-growing renewable energy source worldwide.
        </p>
      </section>
    </div>
  )
}
