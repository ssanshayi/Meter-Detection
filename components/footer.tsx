"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        
        {/* 左侧品牌区域 */}
        <div>
          <h3 className="text-2xl font-bold text-cyan-700 mb-2">昊甲能源</h3>
          <p className="text-sm text-gray-500">HAOJIA Energy</p>
        </div>

        {/* Explore 区块 */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-gray-600 hover:text-cyan-700 transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/resources" className="text-gray-600 hover:text-cyan-700 transition-colors">Resource</Link>
            </li>
            <li>
              <Link href="/category" className="text-gray-600 hover:text-cyan-700 transition-colors">Category</Link>
            </li>
            <li>
              <Link href="/meter-detection" className="text-gray-600 hover:text-cyan-700 transition-colors">Meter-Detection</Link>
            </li>
          </ul>
        </div>

        {/* Resources 区块 */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">Resources</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/resources/research" className="text-gray-600 hover:text-cyan-700 transition-colors">Research</Link>
            </li>
            <li>
              <Link href="/resources/news" className="text-gray-600 hover:text-cyan-700 transition-colors">News</Link>
            </li>
            <li>
              <Link href="/resources/innovation" className="text-gray-600 hover:text-cyan-700 transition-colors">Innovation</Link>
            </li>
          </ul>
        </div>

        {/* Legal 区块 */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">Legal</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy-policy" className="text-gray-600 hover:text-cyan-700 transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="text-gray-600 hover:text-cyan-700 transition-colors">Terms of Service</Link>
            </li>
            <li>
              <Link href="/data-usage" className="text-gray-600 hover:text-cyan-700 transition-colors">Data Usage</Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-600 hover:text-cyan-700 transition-colors">Contact</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} HAOJIA Energy. All rights reserved.
      </div>
    </footer>
  )
}
