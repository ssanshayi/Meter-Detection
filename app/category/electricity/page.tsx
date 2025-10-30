"use client"

import Link from "next/link"
import UsagePieChart, { UsageDatum } from "@/components/usagepiechart"

const usage10y: UsageDatum[] = [
  { year: "2015", value: 21 },
  { year: "2016", value: 21.5 },
  { year: "2017", value: 22 },
  { year: "2018", value: 22.5 },
  { year: "2019", value: 23 },
  { year: "2020", value: 23.5 },
  { year: "2021", value: 24 },
  { year: "2022", value: 24.5 },
  { year: "2023", value: 25 },
  { year: "2024", value: 25.5 },
]

export default function ElectricityPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      {/* Title + Back button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-800">
          Electricity — Professional Overview
        </h1>

        <Link
          href="/category"
          className="inline-flex items-center gap-2 bg-cyan-700 text-white font-medium px-6 py-2 rounded-md shadow-md hover:bg-cyan-800 transition"
        >
          ← Back to Categories
        </Link>
      </div>

      {/* Advantages */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Advantages</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Clean at the point of use with precise metering and controllability.</li>
          <li>Compatible with diverse primary energy sources (fossil, nuclear, renewables).</li>
          <li>Enables electrification of transport, heating, and industry for system decarbonization.</li>
        </ul>
      </section>

      {/* Disadvantages */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Disadvantages</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Demand-supply balancing requires robust grids, flexibility, and storage.</li>
          <li>Capital-intensive transmission and distribution build-out.</li>
          <li>Upstream emissions depend on the generation mix.</li>
        </ul>
      </section>

      {/* Usage Pie (10-year share) */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Usage Frequency (10-Year Share)</h2>
        <p className="text-gray-700 mb-3">Share of electricity in final energy consumption by year (%).</p>
        <UsagePieChart data={usage10y} />
      </section>

      {/* Price */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Price</h2>
        <p className="text-gray-700">
          Wholesale electricity prices over the past decade have been volatile, often ranging
          from <strong>$50–$150 per MWh</strong> depending on region and fuel mix, with 2021–2022 peaks driven by gas prices.
          As renewable penetration rises, prices increasingly exhibit intraday spreads, highlighting the value of storage and demand response.
        </p>
      </section>

      {/* Summary */}
      <section>
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Summary</h2>
        <p className="text-gray-700 leading-7">
          Electricity’s share rose steadily from <strong>~21%</strong> to <strong>~25.5%</strong> over the past decade as end-use sectors electrify.
          Grid modernization and flexibility solutions are pivotal to maintain reliability while integrating high shares of variable renewables.
        </p>
      </section>
    </div>
  )
}
