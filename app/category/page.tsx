'use client'
import { useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import axiosClient from "../axios/axios"
import Sidebar from "../Components/sidebar"
import Player from "../Components/player"
import { CldImage } from "next-cloudinary"
import { ListPlus } from "lucide-react"
import { toast } from "sonner"

export default function CategoryPage() {
  const searchParams = useSearchParams()
  const idParam = searchParams.get("id")
  const [header, setHeader] = useState<any>({})
  const [songs, setSongs] = useState<any>([])
  const [queue, setQueue] = useState<any[]>([])
  const [autoPlay, setAutoPlay] = useState(false)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [selectingIndex, setSelectingIndex] = useState<number | null>(null)
  const [bgColors, setBgColors] = useState<string[]>(["#3b82f6", "#9333ea"])
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    if (!idParam) return
    axiosClient
      .get(`/api/genres/${idParam}`)
      .then((res: any) => {
        const data = res?.data ?? res
        setHeader(data || {})
        const palettes = [
          ["#22c55e", "#14b8a6"],
          ["#3b82f6", "#9333ea"],
          ["#f59e0b", "#ef4444"],
          ["#06b6d4", "#10b981"],
          ["#8b5cf6", "#ec4899"],
        ]
        const pick = palettes[Math.floor(Math.random() * palettes.length)]
        setBgColors(pick)
      })
      .catch(() => {})
  }, [idParam])

  useEffect(() => {
    if (!idParam) return
    axiosClient
      .get(`/api/songs/genre/${idParam}`)
      .then((res: any) => {
        const data = res?.data ?? res
        const list = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : []
        setSongs(list)
      })
      .catch(() => {})
  }, [idParam])

  useEffect(() => {
    axiosClient
      .get('/api/playlists/me')
      .then((res: any) => {
        const data = res?.data ?? res
        const list = Array.isArray(data) ? data : []
        setPlaylists(list.map((p: any) => ({ id: p?.id, title: p?.title || p?.name || 'Untitled' })))
      })
      .catch(() => {})
  }, [])

  function makeTrack(s: any) {
    const src = s?.fileUrl || s?.src || s?.file || ''
    const title = s?.title || s?.songName || s?.name || 'Untitled'
    const artist = s?.artistName || s?.artist?.name || 'Unknown'
    const cover = s?.songCoverUrl || s?.coverUrl || s?.thumbnailUrl || '/1.jpeg'
    return { src, title, artist, cover }
  }

  function play(index: number) {
    const list = Array.isArray(songs) ? songs : []
    const mapped = list.map(makeTrack).filter((t) => t.src)
    if (!mapped.length) return
    const q = [...mapped.slice(index), ...mapped.slice(0, index)]
    setQueue(q)
    setAutoPlay(true)
  }

  function handleAdd(songId: any, playlistId: string) {
    console.log('Added to playlist', songId, playlistId)
    axiosClient
      .post(`/api/playlist-songs`, { songId: songId , playlistId })
      .then(() => { toast.success('Added to playlist') })
      .catch(() => {})
  }

  const sortedSongs = useMemo(() => {
    const list = Array.isArray(songs) ? [...songs] : []
    const norm = (v: any) => String(v || '').toLowerCase().trim()
    list.sort((a: any, b: any) => {
      const at = norm(a?.title || a?.songName)
      const bt = norm(b?.title || b?.songName)
      if (at < bt) return sortAsc ? -1 : 1
      if (at > bt) return sortAsc ? 1 : -1
      return 0
    })
    return list
  }, [songs, sortAsc])

  const totalPages = Math.max(1, Math.ceil(sortedSongs.length / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages, page])

  const displaySongs = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedSongs.slice(start, start + pageSize)
  }, [sortedSongs, page, pageSize])

  function fmtDuration(raw: any) {
    if (raw == null) return "--:--"
    if (typeof raw === 'string') {
      const m = raw.match(/^\d{1,2}:\d{2}$/)
      if (m) return raw
      const n = Number(raw)
      if (!isNaN(n)) return toMMSS(n)
      return "--:--"
    }
    if (typeof raw === 'number') return toMMSS(raw)
    return "--:--"
  }

  function toMMSS(s: number) {
    if (!isFinite(s)) return "--:--"
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${String(sec).padStart(2, '0')}`
  }
  function fmtDate(input: any) {
    if (!input) return ""
    const d = new Date(input)
    if (isNaN(d.getTime())) return ""
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
  }
  const headerName = header?.title || header?.name || idParam || 'Genre'
  const genreCover = header?.coverUrl || header?.imageUrl || '/1.jpeg'

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="flex">
        <div className="w-[280px] flex-shrink-0 sticky top-0 h-screen"><Sidebar /></div>
        <div className="flex-1 px-6 py-6">
          <div className="mb-6">
            <div className="rounded-3xl overflow-hidden border border-white/10">
              <div className="relative h-60" style={{ background: `linear-gradient(90deg, ${bgColors[0]}, ${bgColors[1]})` }}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute left-5 bottom-5 flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-white/20">
                    <CldImage src={genreCover} alt={headerName} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{headerName}</div>
                    <div className="text-white/70 text-xs">{displaySongs.length} songs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10">
            <div className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_2fr_1fr_1fr_100px_120px] items-center px-4 py-3 bg-white/10 text-white/80 text-sm">
              <div>#</div>
              <button onClick={() => setSortAsc(!sortAsc)} className="text-left truncate hover:text-white/90">
                Title {sortAsc ? '▲' : '▼'}
              </button>
              <div className="hidden md:block">Artist</div>
              <div className="hidden md:block">Date</div>
              <div className="hidden md:block">Duration</div>
              <div className="hidden md:block">Action</div>
            </div>
            <ul className="divide-y divide-white/10">
              {displaySongs.map((t: any, i: number) => (
                <li key={`${t.id ?? i}`} className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_2fr_1fr_1fr_100px_120px] items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition">
                <div className="text-white/60 text-sm">{i + 1}</div>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden">
                    <CldImage src={(t?.coverUrl)} alt={t?.songName || "Untitled"} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => play(i)}
                      className="absolute bottom-1 right-1 rounded-full bg-white text-black p-1 shadow"
                      aria-label="Play"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7-11-7z" fill="currentColor"/></svg>
                    </button>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm truncate">{t?.title || "Untitled"}</div>
                    <div className="md:hidden text-white/60 text-xs truncate">{t?.artist.name || "Unknown"}</div>
                  </div>
                </div>
                <div className="hidden md:block text-white/70 text-sm truncate">{t?.artist.name || "Unknown"}</div>
                <div className="hidden md:block text-right text-white/70 text-sm truncate">{fmtDate(t?.addedAt)}</div>
                <div className="hidden md:block text-right text-white/60 text-sm">{fmtDuration(t?.duration ?? t?.length)}</div>
                <div className="hidden md:flex items-center justify-end gap-2 relative">
                  <button
                    type="button"
                    onClick={() => setSelectingIndex(selectingIndex === i ? null : i)}
                    className="rounded-3xl bg-black text-white px-3 py-1.5 text-sm shadow hover:bg-white/20 transition"
                  >
                    <ListPlus width={16} height={16} />
                  </button>
                  {selectingIndex === i && (
                    <div className="absolute right-0 top-10 z-10 w-52 rounded-xl bg-[#1f1f1f] border border-white/10 shadow">
                      <div className="px-3 py-2 text-white/60 text-xs">Select playlist</div>
                      <ul className="max-h-56 overflow-auto">
                        {playlists.map((p: any, idx2: number) => (
                          <li key={idx2}>
                            <button
                              onClick={() => handleAdd(t.id, p.id)}
                              className="w-full text-left px-3 py-2 hover:bg-white/10 text-white/90"
                            >
                              {p.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
              ))}
            </ul>
            <div className="flex items-center justify-between px-4 py-3 bg-white/5">
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm">Page size</span>
                <select value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)) }} className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm">
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n} className="bg-[#121212]">{n}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Prev</button>
                <span className="text-white/70 text-sm">{page} / {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Player queue={queue} autoPlay={autoPlay} offsetLeft={280} />
    </div>
  )
}
