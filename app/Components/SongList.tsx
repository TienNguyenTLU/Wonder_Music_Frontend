"use client"

import { useEffect, useState, useMemo } from "react"
import axiosClient from "../axios/axios"
import { CldImage } from "next-cloudinary"
import { Search, Clock, ListPlus, Play } from "lucide-react"
import AddToPlaylistModal from "./AddToPlaylistModal"
import { toast } from "sonner"
import Player from "./player"

type Props = {
  title: string
  endpoint?: string
  defaultSort?: "newest" | "az" | "za"
  songs?: any[] // Optional: pass songs directly if not fetching
}

export default function SongList({ title, endpoint = "/api/songs", defaultSort = "newest", songs: initialSongs }: Props) {
  const [songs, setSongs] = useState<any[]>(initialSongs || [])
  const [search, setSearch] = useState("")
  const [sortType, setSortType] = useState<"az" | "za" | "newest">(defaultSort)
  
  // Player state
  const [queue, setQueue] = useState<any[]>([])
  const [autoPlay, setAutoPlay] = useState(false)
  const [playKey, setPlayKey] = useState("")

  // Modal state
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null)

  useEffect(() => {
    if (initialSongs) {
        setSongs(initialSongs)
        return
    }
    axiosClient.get(endpoint).then((res: any) => {
        const list = Array.isArray(res) ? res : (res?.data || [])
        setSongs(list)
    }).catch(() => toast.error("Failed to load songs"))
  }, [endpoint, initialSongs])

  const filtered = useMemo(() => {
    let list = [...songs]
    
    // Filter
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s => 
        (s.title || s.songName || "").toLowerCase().includes(q) || 
        (s.artistName || s.artist?.name || "").toLowerCase().includes(q)
      )
    }

    // Sort
    list.sort((a, b) => {
      if (sortType === "newest") {
        return new Date(b.createdAt || b.songCreatedAt).getTime() - new Date(a.createdAt || a.songCreatedAt).getTime()
      }
      const na = (a.title || a.songName || "").toLowerCase()
      const nb = (b.title || b.songName || "").toLowerCase()
      if (sortType === "az") return na.localeCompare(nb)
      if (sortType === "za") return nb.localeCompare(na)
      return 0
    })

    return list
  }, [songs, search, sortType])

  function play(song: any) {
    setQueue([{
        src: song.fileUrl,
        title: song.title || song.songName,
        artist: song.artistName || song.artist?.name || "Unknown",
        cover: song.coverUrl || song.songCoverUrl || "/1.jpeg"
    }])
    setAutoPlay(true)
    setPlayKey(Math.random().toString())
  }

  function openAddToPlaylist(e: React.MouseEvent, songId: string) {
    e.stopPropagation()
    setSelectedSongId(songId)
    setAddModalOpen(true)
  }

  function fmtDate(d: string) {
    if (!d) return "-"
    return new Date(d).toLocaleDateString()
  }

  return (
    <div className="w-full min-h-screen">
        <div className="p-8 pb-28">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" width={18} />
                <input 
                  type="text" 
                  placeholder="Search songs..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  className="bg-white/10 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/30 transition w-64"
                />
              </div>
              <select 
                value={sortType}
                onChange={(e) => setSortType(e.target.value as any)}
                className="bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#222]">Newest</option>
                <option value="az" className="bg-[#222]">A-Z</option>
                <option value="za" className="bg-[#222]">Z-A</option>
              </select>
            </div>
          </div>

          {/* List Header */}
          <div className="grid grid-cols-[40px_2fr_1fr_120px_60px] gap-4 px-4 py-2 text-white/50 text-sm border-b border-white/10 mb-2">
            <div>#</div>
            <div>Title</div>
            <div>Artist</div>
            <div className="flex items-center gap-1"><Clock width={14} /> Date</div>
            <div className="text-center">Add</div>
          </div>

          {/* List */}
          <div className="space-y-1">
            {filtered.map((song, i) => (
              <div 
                key={song.id}
                className="group grid grid-cols-[40px_2fr_1fr_120px_60px] items-center gap-4 px-4 py-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
                onClick={() => play(song)}
              >
                <div className="text-white/50 group-hover:text-white">{i + 1}</div>
                
                {/* Title & Cover */}
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative w-10 h-10 rounded overflow-hidden bg-white/5 flex-shrink-0">
                    <CldImage 
                      src={song.coverUrl || song.songCoverUrl || "/1.jpeg"} 
                      alt={song.title || "Song"} 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <Play fill="white" width={14} height={14} />
                    </div>
                  </div>
                  <div className="font-medium truncate text-white/90">{song.title || song.songName}</div>
                </div>

                {/* Artist */}
                <div className="text-sm text-white/70 truncate">
                  {song.artistName || song.artist?.name || "Unknown"}
                </div>

                {/* Date */}
                <div className="text-sm text-white/50 truncate">
                  {fmtDate(song.createdAt || song.songCreatedAt)}
                </div>

                {/* Add Button */}
                <div className="flex justify-center">
                  <button 
                    onClick={(e) => openAddToPlaylist(e, song.id)}
                    className="p-2 rounded-full hover:bg-white/20 text-white/50 hover:text-white transition"
                    title="Add to playlist"
                  >
                    <ListPlus width={18} />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-10 text-white/50">No songs found</div>
            )}
          </div>
        </div>

        <Player key={playKey} queue={queue} autoPlay={autoPlay} offsetLeft={280} />
        
        <AddToPlaylistModal 
          open={addModalOpen} 
          onOpenChange={setAddModalOpen} 
          songId={selectedSongId} 
        />
    </div>
  )
}
