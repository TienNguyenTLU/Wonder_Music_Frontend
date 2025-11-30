"use client"

import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { useEffect, useState } from "react"
import axiosClient from "../../axios/axios"
import { Poppins } from "next/font/google"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

type PlaylistItem = { title: string; cover: string }

export default function HomePlaylists() {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    axiosClient
      .get("/api/playlists/me")
      .then((data: any) => {
        const list = Array.isArray(data) ? data : []
        const mapped = list.map((p: any) => ({
          title: p?.title || p?.name || "Untitled",
          cover: p?.coverUrl || p?.imageUrl || "/1.jpeg",
        }))
        setPlaylists(mapped)
        setError("")
      })
      .catch((err: any) => setError(err?.response?.data?.message || "Failed to load playlists"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className={`${poppins.className} space-y-4`}>
      <h2 className="text-white text-3xl font-bold">Your playlist</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/10 h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <Swiper modules={[Autoplay]} autoplay={{ delay: 1500, disableOnInteraction: false, pauseOnMouseEnter: true }} loop slidesPerView={4} spaceBetween={16}>
          {playlists.map((pl: any, i: number) => (
            <SwiperSlide key={i}>
              <Link href="/playlist" className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden hover:bg-white/10 transition block">
                <div className="relative w-full aspect-[4/3]">
                  <CldImage src={pl.cover} alt={pl.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-white text-sm font-semibold">{pl.title}</div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}

