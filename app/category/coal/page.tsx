"use client"

import Link from "next/link"
import UsagePieChart, { UsageDatum } from "@/components/usagepiechart"

const usage10y: UsageDatum[] = [
  { year: "2015", value: 33 },
  { year: "2016", value: 32 },
  { year: "2017", value: 31 },
  { year: "2018", value: 30 },
  { year: "2019", value: 29 },
  { year: "2020", value: 28 },
  { year: "2021", value: 27 },
  { year: "2022", value: 26 },
  { year: "2023", value: 25 },
  { year: "2024", value: 24 },
]

export default function CoalPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-800">
          Coal — Professional Overview
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
          <li>Abundant reserves and established global supply chains.</li>
          <li>Stable cost structure and reliable baseload generation.</li>
          <li>Existing infrastructure allows high availability and dispatchability.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Disadvantages</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Highest CO₂ and pollutant emissions among major fuels.</li>
          <li>Facing increasing regulation and financial divestment pressure.</li>
          <li>Potential stranded asset risks under decarbonization policies.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Usage Frequency (10-Year Share)</h2>
        <p className="text-gray-700 mb-3">Global primary energy share by year (%).</p>
        <UsagePieChart data={usage10y} />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Price</h2>
        <p className="text-gray-700">
          Over the last decade, seaborne thermal coal prices fluctuated between <strong>$80–$150 per ton</strong>,
          peaking in 2022 due to energy security concerns. Prices have since normalized but long-term demand continues
          to decline amid the renewable transition.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Summary</h2>
        <p className="text-gray-700 leading-7">
          Coal’s share fell from <strong>33%</strong> to <strong>24%</strong> in the past decade, reflecting global
          decarbonization efforts. While still vital for industrial baseload, coal faces structural decline driven
          by carbon pricing and green financing policies.
        </p>
      </section>
    </div>
  )
}
