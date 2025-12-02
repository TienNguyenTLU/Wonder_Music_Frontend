"use client"
import { CldImage } from "next-cloudinary"
import { Poppins } from "next/font/google"
import Player from "./player"
import Sidebar from "./sidebar"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import axiosClient from "../axios/axios"
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })
export default function PlaylistView({ name }: { name?: string }) {
  const [playNow, setPlayNow] = useState(false)
  const [recommendTerm, setRecommendTerm] = useState<any[]>([])
  const searchParams = useSearchParams()
  const currentPid = useMemo(() => searchParams.get("id") || name || "1", [searchParams, name])
  const [playerQueue, setPlayerQueue] = useState<any[]>([])
  const [playKey, setPlayKey] = useState<string>("")
  const [playlistSongs, setPlaylistSongs] = useState<any[]>([])
  const [playlistDetail, setPlaylistDetail] = useState<any>({})
  const [searchText, setSearchText] = useState<string>("")
  const [recommendAll, setRecommendAll] = useState<any[]>([])
    function startPlay(queue: any[]) {
        setPlayerQueue(queue)
        setPlayKey(Math.random().toString(36).substring(2))
        setPlayNow(true)
    }
    function playNext() {
        if (playerQueue.length === 0) return
        setPlayerQueue(playerQueue.slice(1))
        setPlayKey(Math.random().toString(36).substring(2))
    }
  function playTrackFromPlaylist(track: any) {
    setPlayerQueue([track])
    setPlayKey(Math.random().toString(36).substring(2))
    setPlayNow(true)
  }
  const DEFAULT_REMOTE = "https://res.cloudinary.com/demo/image/upload/sample"
  const safeRemoteSrc = (s?: any, fallback: string = DEFAULT_REMOTE) => {
    const v = typeof s === "string" ? s.trim() : ""
    return v || fallback
  }
  const fmtDate = (d?: string) => {
    if (!d) return ""
    const dt = new Date(d)
    const dd = String(dt.getDate()).padStart(2, "0")
    const mm = String(dt.getMonth() + 1).padStart(2, "0")
    const yy = String(dt.getFullYear()).slice(-2)
    return `${dd}/${mm}/${yy}`
  }
    const getPlaylistSong = async (currentPid: string): Promise<any[]> => {
        await axiosClient.get(`/api/playlists/${currentPid}/songs`)
        .then((res: any) => {
            const list = Array.isArray(res) ? res : []
            setPlaylistSongs(list)
        })
        .catch(() => {})
        return playlistSongs
    }
    const getPlaylistDetail = async (currentPid: string): Promise<any[]> => {
        await axiosClient.get(`/api/playlists/${currentPid}`)
        .then((res: any) => {
            const detail = res
            setPlaylistDetail(detail)
        })
        .catch(() => {})
        return playlistDetail
    }
    const getRecommendSong = async() : Promise<any[]> => 
    {
        await axiosClient.get(`/api/songs`)
        .then((res: any) => {
            const list = Array.isArray(res) ? res : []
            const shuffled = list.sort(() => 0.5 - Math.random())
            const top = shuffled.slice(0, 5)
            setRecommendTerm(top)
            setRecommendAll(list)
        })
        .catch(() => {})
        return recommendTerm
    }
    const addSongtoPlaylist = async (track: any) => {
      const songId = track?.id ?? track?.songId
      if (!songId) return
      const exists = playlistSongs.some((s: any) => (s?.songId ?? s?.id) === songId)
      if (exists) {
        toast.error("Song already in playlist")
        return
      }
      try {
        await axiosClient.post(`/api/playlist-songs`, { playlistId: currentPid, songId })
        toast.success("Add song to playlist success")
        await getPlaylistSong(currentPid)
      } catch (error) {
        toast.error("Add song to playlist failed")
      }
    }
    const handleSearch = (term: string) => {
      setSearchText(term)
      const q = term.trim().toLowerCase()
      if (!q) {
        setRecommendTerm(recommendTerm)
        return
      }
      setRecommendTerm(
        recommendAll.filter((s: any) => (
          ((s.songName || s.title || s.name || "") + " " + (s.artistName || s.artist?.name || s.artist || "")).toLowerCase().includes(q)
        ))
      )
    }
    const handleDelete = async (track: any) => {
      const songId = track?.id ?? track?.songId
      if (!songId) return
      try {
        await axiosClient.delete(`/api/playlist-songs/${songId}`)
        toast.success("Delete song from playlist success")
        await getPlaylistSong(currentPid)
      } catch (error) {
        toast.error("Delete song from playlist failed")
      }
    }
    useEffect(() => {
        getRecommendSong()
    }, [])
    useEffect(() => {
        getPlaylistDetail(currentPid)
        getPlaylistSong(currentPid)
    }, [currentPid])
  return (
    <main className={`${poppins.className} w-full min-h-screen pb-28 pl-[280px]`}>
      <div className="fixed top-0 left-0 h-full w-[280px]">
        <Sidebar />
      </div>
      <section className="relative w-full">
        <div className="relative w-full h-64 md:h-72 overflow-hidden">
          <CldImage src={safeRemoteSrc(playlistDetail?.wallpaperUrl || playlistDetail?.coverUrl)} alt="Playlist wallpaper" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 z-10 flex items-end gap-5">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden ring-2 ring-white/10">
              <CldImage src={safeRemoteSrc(playlistDetail?.coverUrl)} alt={playlistDetail?.name || "Playlist name"} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-4xl font-bold truncate">{playlistDetail?.name || "Playlist name"}</h1>
              <div className="mt-2 text-white/70 text-sm">{playlistSongs.length} tracks</div>
              <button
                onClick={() => startPlay(playlistSongs.map((s: any) => ({ src: s?.fileUrl || "", title: s?.songName || "Untitled", artist: s?.artistName || "Unknown", cover: safeRemoteSrc(s?.songCoverUrl) })) as any)}
                className="mt-4 inline-flex items-center justify-center rounded-3xl bg-white text-black px-5 py-2 shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20"
              >
                Play playlist
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-8 py-8">
        <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
          <div className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_2fr_1fr_1fr_100px_120px] px-4 py-3 text-white/70 text-xs">
            <div>#</div>
            <div>Title</div>
            <div className="hidden md:block">Artist</div>
            <div className="hidden md:block text-right">Added at</div>
            <div className="hidden md:block text-right">Duration</div>
            <div className="hidden md:block text-right">Action</div>
          </div>
          <ul>
            {playlistSongs.map((t: any, i: number) => (
              <li key={`${t.id ?? i}`} className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_2fr_1fr_1fr_100px_120px] items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition">
                <div className="text-white/60 text-sm">{i + 1}</div>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden">
                    <CldImage src={safeRemoteSrc(t?.songCoverUrl)} alt={t?.songName || "Untitled"} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => playTrackFromPlaylist({ src: t?.fileUrl || "", title: t?.songName || "Untitled", artist: t?.artistName || "Unknown", cover: safeRemoteSrc(t?.songCoverUrl)})}
                      className="absolute bottom-1 right-1 rounded-full bg-white text-black p-1 shadow"
                      aria-label="Play"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7-11-7z" fill="currentColor"/></svg>
                    </button>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm truncate">{t?.songName || "Untitled"}</div>
                    <div className="md:hidden text-white/60 text-xs truncate">{t?.artistName || "Unknown"}</div>
                  </div>
                </div>
                <div className="hidden md:block text-white/70 text-sm truncate">{t?.artistName || "Unknown"}</div>
                <div className="hidden md:block text-right text-white/70 text-sm truncate">{fmtDate(t?.addedAt)}</div>
                <div className="hidden md:block text-right text-white/60 text-sm">{typeof t?.duration === 'number' ? `${Math.floor(t.duration/60)}:${Math.floor(t.duration%60).toString().padStart(2,'0')}` : "—"}</div>
                <div className="hidden md:flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(t)}
                    className="rounded-3xl bg-white text-black px-3 py-1.5 text-sm shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="w-full px-8 pb-24">
        <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-3">
            <input
              type="search"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search your music"
              className="w-full rounded-3xl bg-white text-black pl-4 pr-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <ul>
              {recommendTerm.map((t: any, i: number) => (
                <li key={`${t.id ?? i}`} className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_120px] items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <CldImage src={safeRemoteSrc(t?.coverUrl || t?.imageUrl || t?.thumbnailUrl)} alt={(t?.title || t?.name || "Untitled")} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => startPlay([{ src: (t?.fileUrl) || "", title: t?.title || t?.name || "Untitled", artist: (t?.artistName || t?.artist?.name || "Unknown"), cover: safeRemoteSrc(t?.coverUrl || t?.imageUrl || t?.thumbnailUrl) }])}
                        className="absolute bottom-1 right-1 rounded-full bg-white text-black p-1 shadow opacity-0 group-hover:opacity-100 transition"
                        aria-label="Play"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7-11-7z" fill="currentColor"/></svg>
                      </button>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm truncate">{t?.title || t?.name || "Untitled"}</div>
                      <div className="text-white/60 text-xs truncate">{t?.artistName || t?.artist.name || "Unknown"}</div>
                    </div>
                  </div>
                  <div className="text-right flex items-center justify-end gap-2">
                    {playlistSongs.some((s: any) => (s?.songId ?? s?.id) === (t?.id ?? t?.songId)) ? (
                      <div className="inline-flex items-center justify-center rounded-3xl bg-green-500 text-white px-4 py-1.5 text-sm shadow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6l-11 11-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addSongtoPlaylist(t)}
                        className="inline-flex items-center justify-center rounded-3xl bg-white text-black px-4 py-1.5 text-sm shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20"
                      >Add</button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>
      <Player key={playNow ? `playing-${playKey}` : "idle"} queue={playerQueue.length ? playerQueue as any : (playlistSongs.length ? playlistSongs.map((s: any) => ({ src: s?.fileUrl || "", title: s?.songName || "Untitled", artist: s?.artistName || "Unknown", cover: safeRemoteSrc(s?.songCoverUrl) })) as any : undefined)} autoPlay={playNow} offsetLeft={280} />
    </main>
  )
}
