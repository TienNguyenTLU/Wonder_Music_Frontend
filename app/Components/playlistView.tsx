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
type Playlist = {
    id: number
    playlistTitle: string
    playlistCoverUrl: string
    playlistWallpaperUrl: string
    songs: any[]
}
export default function PlaylistView({ name }: { name?: string }) {
  const [playNow, setPlayNow] = useState(false)
  const [recommendTerm, setRecommendTerm] = useState("")
  const [playlist, setPlaylist] = useState<Playlist[]>([])
  const [playlistDetail, setPlaylistDetail] = useState<any>()
  const [recommend, setRecommend] = useState<any[]>([])
  const searchParams = useSearchParams()
  const headerTitle = useMemo(() => playlist[0]?.playlistTitle || "Playlist", [playlist])
  const currentPid = useMemo(() => searchParams.get("id") || name || "1", [searchParams, name])
  const [playerQueue, setPlayerQueue] = useState<any[]>([])
  const [playKey, setPlayKey] = useState<string>("")
    function getRecommend() {
        axiosClient.get(`/api/songs`)
        .then((res: any) => {
            setRecommend(res)
        })
        .catch(() => {})
    }
    useEffect(() => {
        getRecommend()
    }, [recommendTerm])
    function getPlaylist() {
        axiosClient.get(`/api/playlists/${currentPid}/songs`)
        .then((res: any) => {
            const list = Array.isArray(res) ? res : []
            setPlaylist(list)
        })
        .catch(() => {})
    }
    function getPlaylistDetail() {
        axiosClient.get(`/api/playlists/${currentPid}`)
        .then((res: any) => {
            setPlaylistDetail(res)
        })
        .catch(() => {})
    }
    useEffect(() => {
        getPlaylist()
        getPlaylistDetail()
    }, [currentPid])
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
    var formData ={}
    function addTrackToPlaylist(track: any) {
        if(track.id in playlist.map((s: any) => s.id))
        {
          toast.error("Track already in playlist")
          return
        }
        else
        {
          try
          {axiosClient.post('/api/playlist-songs', 
             formData = {
            "playlistId": currentPid,
            "songId": track.id
            }
         )
         console.log(formData)
         toast.success("Added track to playlist")} catch (error) {toast.error("Add track to playlist failed")}
        }
    }
    function removeTrackFromPlaylist(track: any) {
        setPlaylist(playlist.filter((s: any) => s.songId !== track.songId))
    }

  return (
    <main className={`${poppins.className} w-full min-h-screen pb-28 pl-[280px]`}>
      <div className="fixed top-0 left-0 h-full w-[280px]">
        <Sidebar />
      </div>
      <section className="relative w-full">
        <div className="relative w-full h-64 md:h-72 overflow-hidden">
          <CldImage src={(playlistDetail?.wallpaperUrl || playlistDetail?.coverUrl)} alt="Playlist wallpaper" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 z-10 flex items-end gap-5">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden ring-2 ring-white/10">
              <CldImage src={(playlistDetail?.coverUrl || "/1.jpeg")} alt={headerTitle} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-4xl font-bold truncate">{headerTitle}</h1>
              <div className="mt-2 text-white/70 text-sm">{playlist.length} tracks</div>
              <button
                onClick={() => startPlay(playlist.map((s: any) => ({ src: s?.fileUrl || "", title: s?.songName || "Untitled", artist: s?.artistName || "Unknown", cover: s?.songCoverUrl || "/track1.jpg" })) as any)}
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
          <div className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_2fr_1fr_1fr_120px] px-4 py-3 text-white/70 text-xs">
            <div>#</div>
            <div>Title</div>
            <div className="hidden md:block">Artist</div>
            <div className="hidden md:block text-right">Added at</div>
            <div className="hidden md:block text-right">Duration</div>
          </div>
          <ul>
            {playlist.map((t: any, i: number) => (
              <li key={`${t.id ?? i}`} className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_2fr_1fr_1fr_120px] items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition">
                <div className="text-white/60 text-sm">{i + 1}</div>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden">
                    <CldImage src={(t?.songCoverUrl || "/track1.jpg")} alt={t?.songName || "Untitled"} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm truncate">{t?.songName || "Untitled"}</div>
                    <div className="md:hidden text-white/60 text-xs truncate">{t?.artistName || "Unknown"}</div>
                  </div>
                </div>
                <div className="hidden md:block text-white/70 text-sm truncate">{t?.artistName || "Unknown"}</div>
                <div className="hidden md:block text-right text-white/70 text-sm truncate">{t?.addedAt || ""}</div>
                <div className="hidden md:flex items-center justify-end gap-2 text-white/60 text-sm">
                  <span>{typeof t?.duration === 'number' ? `${Math.floor(t.duration/60)}:${Math.floor(t.duration%60).toString().padStart(2,'0')}` : "—"}</span>
                  <button
                    onClick={() => playTrackFromPlaylist({ src: t?.fileUrl || "", title: t?.songName || "Untitled", artist: t?.artistName || "Unknown", cover: t?.songCoverUrl || "/track1.jpg" })}
                    className="rounded-full bg-white text-black p-1.5 shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20"
                    aria-label="Play"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7-11-7z" fill="currentColor"/></svg>
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
              value={recommendTerm}
              onChange={(e) => setRecommendTerm(e.target.value)}
              placeholder="Search music to add"
              className="w-full rounded-3xl bg-white text-black pl-4 pr-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <ul>
            {recommend.filter((r: any) => (recommendTerm ? ((r.title || r.name || "") + ' ' + (r.artistName || r.artist.name || "")).toLowerCase().includes(recommendTerm.toLowerCase()) : true)).slice(0, 10).map((t: any, i: number) => (
              <li key={`${t.id ?? i}`} className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_120px] items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden">
                    <CldImage src={(t?.coverUrl || t?.imageUrl || t?.thumbnailUrl || "/track1.jpg")} alt={(t?.title || t?.name || "Untitled")} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm truncate">{t?.title || t?.name || "Untitled"}</div>
                    <div className="text-white/60 text-xs truncate">{t?.artistName || t?.artist.name || "Unknown"}</div>
                  </div>
                </div>
                <div className="text-right flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => startPlay([{ src: (t?.fileUrl) || "", title: t?.title || t?.name || "Untitled", artist: (t?.artistName || t?.artist?.name || "Unknown"), cover: (t?.coverUrl || t?.imageUrl || t?.thumbnailUrl || "/track1.jpg") }])}
                    className="rounded-full bg-white text-black p-1.5 shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20"
                    aria-label="Play"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7-11-7z" fill="currentColor"/></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => addTrackToPlaylist(t)}
                    className="inline-flex items-center justify-center rounded-3xl bg-white text-black px-4 py-1.5 text-sm shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20"
                  >
                    Add
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Player key={playNow ? `playing-${playKey}` : "idle"} queue={playerQueue.length ? playerQueue as any : (playlist.length ? playlist.map((s: any) => ({ src: s?.fileUrl || "", title: s?.songName || "Untitled", artist: s?.artistName || "Unknown", cover: s?.songCoverUrl || "/track1.jpg" })) as any : undefined)} autoPlay={playNow} offsetLeft={280} />
    </main>
  )
}
