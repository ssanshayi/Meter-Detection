"use client";

import { Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center text-center px-4">
      {/* 图标 */}
      <Gauge className="h-16 w-16 text-cyan-700 mb-6" />

      {/* 标题 */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-800 mb-4 tracking-tight">
        Welcome to <span className="text-cyan-600">HAOJIA Energy!</span>
      </h1>

      {/* 描述 */}
      <p className="text-lg text-gray-600 max-w-2xl mb-10">
        Empowering smarter energy solutions with AI-driven insights and sustainable technology.
      </p>

      {/* 按钮：点击后进入首页 */}
      <Link href="/home">
        <Button className="px-6 py-3 text-lg bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl shadow-md">
          Get Started
        </Button>
      </Link>

      {/* 页脚 */}
      <p className="text-sm text-gray-400 mt-10">
        © {new Date().getFullYear()} HAOJIA Energy · All rights reserved
      </p>
    </div>
  );
}
