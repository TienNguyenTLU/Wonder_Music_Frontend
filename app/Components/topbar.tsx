'use client'

import Link from 'next/link'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })

export default function TopBar() {
  return (
    <header className={`${poppins.className} w-full`}>
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-[#ff6500] text-lg font-semibold transform transition-all duration-300 hover:scale-110 hover:text-white/90">Wonder Music</Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/music" className="text-white/90 transform transition-all duration-300 hover:scale-120 hover:text-white">Music</Link>
            <Link href="/artist" className="text-white/90 transform transition-all duration-300 hover:scale-120 hover:text-white">Artist</Link>
            <Link href="/explore" className="text-white/90 transform transition-all duration-300 hover:scale-120 hover:text-white">Explore</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-3xl bg-white text-black px-4 py-2 transform transition-all duration-300 hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/20">Login</Link>
          <Link href="/signup" className="rounded-3xl bg-white text-black px-4 py-2 transform transition-all duration-300 hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/20">Sign up</Link>
        </div>
      </div>
    </header>
  )
}