"use client"

import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { useEffect, useState } from "react"
import axiosClient from "../../axios/axios"
import { Poppins } from "next/font/google"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

type PlaylistItem = { title: string; cover: string }

export default function HomePlaylists() {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    axiosClient
      .get("/api/playlists")
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(loading ? Array.from({ length: 4 }) : playlists.slice(0, 4)).map((pl: any, i: number) => (
          <Link key={i} href="/playlist" className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden hover:bg-white/10 transition">
            <div className="relative w-full aspect-[4/3]">
              {loading ? (
                <div className="w-full h-full bg-white/10 animate-pulse" />
              ) : (
                <CldImage src={pl.cover} alt={pl.title} fill className="object-cover" />
              )}
            </div>
            <div className="p-4">
              <div className="text-white text-sm font-semibold">{loading ? "Loading..." : pl.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

