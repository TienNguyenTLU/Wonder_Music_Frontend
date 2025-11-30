"use client"

import { CldImage } from "next-cloudinary"
import { useEffect, useState } from "react"
import axiosClient from "../../axios/axios"
import { Poppins } from "next/font/google"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

type Artist = { name: string; avatarUrl: string }

export default function HomeArtists() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => {
    axiosClient
      .get("/api/artists")
      .then((data: any) => {
        const list = Array.isArray(data) ? data : []
        setArtists(list as Artist[])
        setError("")
      })
      .catch((err: any) => setError(err?.response?.data?.message || "Failed to load artists"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className={`${poppins.className} space-y-4`}>
      <h2 className="text-white text-3xl font-bold">New from your favourite artist</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(loading ? Array.from({ length: 4 }) : artists.slice(0, 4)).map((it: any, i: number) => (
          <div key={i} className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
            <div className="relative w-full aspect-[4/3]">
              {loading ? (
                <div className="w-full h-full bg-white/10 animate-pulse" />
              ) : (
                <CldImage src={it.avatarUrl} alt={it.name} fill className="object-cover" />
              )}
            </div>
            <div className="p-4">
              <div className="text-white text-sm font-semibold">{loading ? "Loading..." : it.name}</div>
              <div className="text-white/70 text-xs">New release</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

