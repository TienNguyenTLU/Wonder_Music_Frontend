"use client"

import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { useEffect, useState } from "react"
import axiosClient from "../../axios/axios"
import { Poppins } from "next/font/google"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

type Category = { id: string; name: string; src: string }

export default function HomeCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    axiosClient
      .get("/api/genres")
      .then((data: any) => {
        const list = Array.isArray(data) ? data : []
        const mapped = list.map((g: any) => ({
          id: g?.id || "unknown",
          name: g?.name || g?.genreName || "Unknown",
          src: g?.imageUrl || g?.cover || "/1.jpeg",
        }))
        setCategories(mapped)
        setError("")
      })
      .catch((err: any) => setError(err?.response?.data?.message || "Failed to load genres"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className={`${poppins.className} space-y-4`}>
      <h2 className="text-white text-3xl font-bold">Explore your music journey</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Link key={i} href={`/category?id=${encodeURIComponent(cat.id)}`} className="relative w-full aspect-square rounded-2xl overflow-hidden hover:bg-white/10 transition">
              <CldImage src={cat.src} alt={cat.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-white text-sm font-semibold">{cat.name}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

