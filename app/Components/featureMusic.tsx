'use client'
import { Poppins } from 'next/font/google'
import 'swiper/css'
import 'swiper/css/navigation'

export default function FeatureMusic() {
  return (
    <div>
        <h3 className="text-center text-3xl mx-auto font-bold text-white/90 mb-6">Start your music journey today</h3>
        <h4 className="text-center text-3xl mx-auto font-bold text-white/90 mb-6">Save tracks, follow artists and build playlists. All for free.</h4>
        <div className="flex justify-center gap-4">
            <a href="/" className="rounded-full text-white px-4 py-2 transform transition-all duration-300 hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/20">
                Sign up for free
            </a>
            <a href="/login" className="rounded-full bg-white text-black px-4 py-2 transform transition-all duration-300 hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/20">
                Log in
            </a>
        </div>
    </div>
  )
}