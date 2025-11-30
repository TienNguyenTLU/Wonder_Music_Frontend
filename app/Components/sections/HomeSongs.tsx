"use client"

import { CldImage } from "next-cloudinary"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { useEffect, useState } from "react"
import axiosClient from "../../axios/axios"
import { Poppins } from "next/font/google"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

type Song = { title: string; coverUrl: string }

export default function HomeSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    axiosClient
      .get("/api/songs")
      .then((data: any) => {
        const list = Array.isArray(data) ? data : []
        setSongs(list as Song[])
        setError("")
      })
      .catch((err: any) => setError(err?.response?.data?.message || "Failed to load songs"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className={`${poppins.className} space-y-4`}>
      <h2 className="text-white text-3xl font-bold">Recommend for you</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {loading ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/10 h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <Swiper modules={[Autoplay, Navigation]} navigation autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }} loop spaceBetween={16} slidesPerView={3} breakpoints={{ 768: { slidesPerView: 4 }, 1024: { slidesPerView: 6 } }}>
          {songs.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
                <div className="relative w-full aspect-[4/3]">
                  <CldImage src={item.coverUrl} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <div className="text-white text-sm font-semibold">{item.title}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}

