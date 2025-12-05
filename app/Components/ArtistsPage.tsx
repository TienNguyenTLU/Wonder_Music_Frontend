"use client"

import { useState, useEffect, useMemo } from "react"
import axiosClient from "../axios/axios"
import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { Search } from "lucide-react"

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    axiosClient.get("/api/artists").then((res: any) => {
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []
      setArtists(list)
    }).catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    let list = [...artists]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(a => (a.name || "").toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      const na = (a.name || "").toLowerCase()
      const nb = (b.name || "").toLowerCase()
      if (na < nb) return sortAsc ? -1 : 1
      if (na > nb) return sortAsc ? 1 : -1
      return 0
    })
    return list
  }, [artists, search, sortAsc])

  return (
    <div className="px-10 py-10 text-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Artists</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" width={18} />
            <input 
              type="text" 
              placeholder="Search artists..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/30 transition w-64"
            />
          </div>
          <button 
            onClick={() => setSortAsc(!sortAsc)}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm transition"
          >
            Sort: {sortAsc ? "A-Z" : "Z-A"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filtered.map((artist: any) => (
          <Link 
            key={artist.id} 
            href={`/home/artist/${artist.id}`}
            className="group bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition flex flex-col items-center gap-4 border border-white/5 hover:border-white/20"
          >
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition duration-300">
              <CldImage 
                src={artist.avatarUrl || artist.image || "/1.jpeg"} 
                alt={artist.name} 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg truncate max-w-[180px]">{artist.name}</div>
              <div className="text-white/50 text-xs mt-1">Artist</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
