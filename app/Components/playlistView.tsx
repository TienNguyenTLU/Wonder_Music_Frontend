"use client"
import { CldImage } from "next-cloudinary"
import { Poppins } from "next/font/google"
import Player from "./player"
import Sidebar from "./sidebar"
import { useMemo, useState } from "react"
import { toast } from "sonner"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

type Track = { id?: string; src: string; title: string; artist: string; cover: string; duration?: number }
type PlaylistData = { id?: string; name: string; cover: string; wallpaper: string; tracks: Track[] }

export default function PlaylistView({ name }: { name?: string }) {
  const [playNow, setPlayNow] = useState(false)
  const [recommendTerm, setRecommendTerm] = useState("")
  const [data, setData] = useState<PlaylistData>({
    name: name || "Daily Mix",
    cover: "/1.jpeg",
    wallpaper: "/wallpaper.jpg",
    tracks: [
      { id: "t1", src: "/audio/track1.mp3", title: "Clair Obscur E33", artist: "Lorien Testard", cover: "/track1.jpg", duration: 204 },
      { id: "t2", src: "/audio/track2.mp3", title: "Let me love you", artist: "Justin Bieber", cover: "/track2.jpg", duration: 200 },
      { id: "t3", src: "/audio/track3.mp3", title: "Waiting for love", artist: "Avicii", cover: "/track3.jpg", duration: 210 },
      { id: "t4", src: "/audio/track4.mp3", title: "The Night", artist: "Avicii", cover: "/track4.jpg", duration: 215 },
      { id: "t5", src: "/audio/track5.mp3", title: "We dont talk any more", artist: "Charlie Puth", cover: "/track5.jpg", duration: 232 },
    ],
  })
  const [recommend] = useState<Track[]>([
    { id: "r1", src: "/audio/track1.mp3", title: "Clair Obscur E33", artist: "Lorien Testard", cover: "/track1.jpg" },
    { id: "r2", src: "/audio/track2.mp3", title: "Let me love you", artist: "Justin Bieber", cover: "/track2.jpg" },
    { id: "r3", src: "/audio/track3.mp3", title: "Waiting for love", artist: "Avicii", cover: "/track3.jpg" },
    { id: "r4", src: "/audio/track4.mp3", title: "The Night", artist: "Avicii", cover: "/track4.jpg" },
    { id: "r5", src: "/audio/track5.mp3", title: "We dont talk any more", artist: "Charlie Puth", cover: "/track5.jpg" },
    { id: "r6", src: "/audio/track6.mp3", title: "Bad guy", artist: "Billie Eilish", cover: "/track1.jpg" },
    { id: "r7", src: "/audio/track7.mp3", title: "Blinding Lights", artist: "The Weeknd", cover: "/track2.jpg" },
    { id: "r8", src: "/audio/track8.mp3", title: "Levitating", artist: "Dua Lipa", cover: "/track3.jpg" },
    { id: "r9", src: "/audio/track9.mp3", title: "Uptown Funk", artist: "Bruno Mars", cover: "/track4.jpg" },
    { id: "r10", src: "/audio/track10.mp3", title: "Shape of You", artist: "Ed Sheeran", cover: "/track5.jpg" },
  ])

  const headerTitle = useMemo(() => data.name || "Playlist", [data.name])

  function addTrackToPlaylist(track: Track) {
    setData((prev) => ({ ...prev, tracks: [...prev.tracks, track] }))
    toast.success('Added to playlist')
  }

  return (
    <main className={`${poppins.className} w-full min-h-screen pb-28 pl-[280px]`}>
      <div className="fixed top-0 left-0 h-full w-[280px]">
        <Sidebar />
      </div>
      <section className="relative w-full">
        <div className="relative w-full h-64 md:h-72 overflow-hidden">
          <CldImage src={data.wallpaper} alt="Playlist wallpaper" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8 z-10 flex items-end gap-5">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden ring-2 ring-white/10">
              <CldImage src={data.cover} alt={headerTitle} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-4xl font-bold truncate">{headerTitle}</h1>
              <div className="mt-2 text-white/70 text-sm">{data.tracks.length} tracks</div>
              <button
                onClick={() => setPlayNow(true)}
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
          <div className="grid grid-cols-[40px_1fr_1fr] md:grid-cols-[60px_2fr_1fr_100px] px-4 py-3 text-white/70 text-xs">
            <div>#</div>
            <div>Title</div>
            <div className="hidden md:block">Artist</div>
            <div className="hidden md:block text-right">Duration</div>
          </div>
          <ul>
            {data.tracks.map((t, i) => (
              <li key={`${t.id ?? i}`} className="grid grid-cols-[40px_1fr_1fr] md:grid-cols-[60px_2fr_1fr_100px] items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition">
                <div className="text-white/60 text-sm">{i + 1}</div>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden">
                    <CldImage src={t.cover} alt={t.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm truncate">{t.title}</div>
                    <div className="md:hidden text-white/60 text-xs truncate">{t.artist}</div>
                  </div>
                </div>
                <div className="hidden md:block text-white/70 text-sm truncate">{t.artist}</div>
                <div className="hidden md:block text-white/60 text-sm text-right">{t.duration ? `${Math.floor(t.duration/60)}:${Math.floor(t.duration%60).toString().padStart(2,'0')}` : "—"}</div>
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
            {recommend.filter((r) => (recommendTerm ? (r.title + ' ' + r.artist).toLowerCase().includes(recommendTerm.toLowerCase()) : true)).slice(0, 10).map((t, i) => (
              <li key={`${t.id ?? i}`} className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_120px] items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden">
                    <CldImage src={t.cover} alt={t.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm truncate">{t.title}</div>
                    <div className="text-white/60 text-xs truncate">{t.artist}</div>
                  </div>
                </div>
                <div className="text-right">
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

      <Player key={playNow ? "playing" : "idle"} queue={data.tracks} autoPlay={playNow} offsetLeft={280} />
    </main>
  )
}
