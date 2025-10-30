"use client"

import Link from "next/link"
import UsagePieChart, { UsageDatum } from "@/components/usagepiechart"

const usage10y: UsageDatum[] = [
  { year: "2015", value: 23 },
  { year: "2016", value: 23.5 },
  { year: "2017", value: 24 },
  { year: "2018", value: 24.5 },
  { year: "2019", value: 25 },
  { year: "2020", value: 25.2 },
  { year: "2021", value: 25.5 },
  { year: "2022", value: 25.3 },
  { year: "2023", value: 25.1 },
  { year: "2024", value: 25.0 },
]

export default function NaturalGasPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-800">
          Natural Gas — Professional Overview
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
          <li>Lower CO₂ emissions per MWh than coal with higher efficiency.</li>
          <li>Flexible generation suitable for peaking and balancing.</li>
          <li>Used across power, heating, and chemical sectors.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Disadvantages</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Price volatility driven by geopolitical and LNG market dynamics.</li>
          <li>Methane leakage undermines climate benefits.</li>
          <li>Dependence on pipelines, storage, and import infrastructure.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Usage Frequency (10-Year Share)</h2>
        <UsagePieChart data={usage10y} />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Price</h2>
        <p className="text-gray-700">
          Benchmark prices (e.g., Henry Hub) averaged <strong>$2–$6/MMBtu</strong> over the decade,
          peaking in 2021–2022 during supply disruptions. Prices are normalizing but remain volatile.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Summary</h2>
        <p className="text-gray-700 leading-7">
          Natural gas maintained a steady <strong>23–25%</strong> global share as a transitional fuel.
          Future viability depends on methane control and the speed of renewable adoption.
        </p>
      </section>
    </div>
  )
}
