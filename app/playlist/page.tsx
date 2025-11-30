"use client"

import { CldImage } from "next-cloudinary"
import { Poppins } from "next/font/google"
import Player from "../Components/player"
import Sidebar from "../Components/sidebar"
import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

const library: Record<string, { name: string; cover: string; wallpaper: string; tracks: { src: string; title: string; artist: string; cover: string }[] }> = {
  "Daily Mix": {
    name: "Daily Mix",
    cover: "/1.jpeg",
    wallpaper: "/wallpaper.jpg",
    tracks: [
      { src: "/audio/track1.mp3", title: "Clair Obscur E33", artist: "Lorien Testard", cover: "/track1.jpg" },
      { src: "/audio/track2.mp3", title: "Let me love you", artist: "Justin Bieber", cover: "/track2.jpg" },
      { src: "/audio/track3.mp3", title: "Waiting for love", artist: "Avicii", cover: "/track3.jpg" },
      { src: "/audio/track4.mp3", title: "The Night", artist: "Avicii", cover: "/track4.jpg" },
      { src: "/audio/track5.mp3", title: "We dont talk any more", artist: "Charlie Puth", cover: "/track5.jpg" },
    ],
  },
  "My Playlist": {
    name: "My Playlist",
    cover: "/playlist1.jpg",
    wallpaper: "/wallpaper.jpg",
    tracks: [
      { src: "/audio/track3.mp3", title: "Waiting for love", artist: "Avicii", cover: "/track3.jpg" },
      { src: "/audio/track4.mp3", title: "The Night", artist: "Avicii", cover: "/track4.jpg" },
    ],
  },
  "Liked Songs": {
    name: "Liked Songs",
    cover: "/liked.jpg",
    wallpaper: "/wallpaper.jpg",
    tracks: [
      { src: "/audio/track1.mp3", title: "Clair Obscur E33", artist: "Lorien Testard", cover: "/track1.jpg" },
      { src: "/audio/track2.mp3", title: "Let me love you", artist: "Justin Bieber", cover: "/track2.jpg" },
    ],
  },
  Recents: {
    name: "Recents",
    cover: "/recents.jpg",
    wallpaper: "/wallpaper.jpg",
    tracks: [
      { src: "/audio/track5.mp3", title: "We dont talk any more", artist: "Charlie Puth", cover: "/track5.jpg" },
      { src: "/audio/track4.mp3", title: "The Night", artist: "Avicii", cover: "/track4.jpg" },
    ],
  },
  "New Releases": {
    name: "New Releases",
    cover: "/new-releases.jpg",
    wallpaper: "/wallpaper.jpg",
    tracks: [
      { src: "/audio/track2.mp3", title: "Let me love you", artist: "Justin Bieber", cover: "/track2.jpg" },
      { src: "/audio/track1.mp3", title: "Clair Obscur E33", artist: "Lorien Testard", cover: "/track1.jpg" },
    ],
  },
}

export default function PlaylistPage() {
  const [playNow, setPlayNow] = useState(false)
  const searchParams = useSearchParams()
  const nameParam = searchParams.get("name") || "Daily Mix"
  const data = useMemo(() => library[nameParam] || library["Daily Mix"], [nameParam])

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
              <CldImage src={data.cover} alt={data.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-4xl font-bold truncate">{data.name}</h1>
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
              <li key={i} className="grid grid-cols-[40px_1fr_1fr] md:grid-cols-[60px_2fr_1fr_100px] items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition">
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
                <div className="hidden md:block text-white/60 text-sm text-right">3:24</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Player key={playNow ? "playing" : "idle"} queue={data.tracks} autoPlay={playNow} offsetLeft={280} />
    </main>
  )
}
