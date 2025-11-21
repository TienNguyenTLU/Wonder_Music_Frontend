"use client"

import Image from "next/image"
import { Poppins } from "next/font/google"
import Sidebar from "../../Components/sidebar"
import Player from "../../Components/player"
import { useState } from "react"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

const playlist = {
  name: "Daily Mix",
  cover: "/1.jpeg",
  wallpaper: "/wallpaper.jpg",
}

const tracks = [
  { src: "/audio/track1.mp3", title: "Clair Obscur E33", artist: "Lorien Testard", cover: "/track1.jpg" },
  { src: "/audio/track2.mp3", title: "Let me love you", artist: "Justin Bieber", cover: "/track2.jpg" },
  { src: "/audio/track3.mp3", title: "Waiting for love", artist: "Avicii", cover: "/track3.jpg" },
  { src: "/audio/track4.mp3", title: "The Night", artist: "Avicii", cover: "/track4.jpg" },
  { src: "/audio/track5.mp3", title: "We dont talk any more", artist: "Charlie Puth", cover: "/track5.jpg" },
]

export default function PlaylistPage() {
  const [playNow, setPlayNow] = useState(false)

  return (
    <main className={`${poppins.className} w-full min-h-screen pl-[280px] pb-28`}>
      <div className="fixed top-0 left-0 h-full w-[280px]">
        <Sidebar />
      </div>

      <section className="relative w-full">
        <div className="relative w-full h-52 sm:h-64 md:h-72 overflow-hidden">
          <Image src={playlist.wallpaper} alt="Playlist wallpaper" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-10 right-10 z-10 flex items-end gap-4">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden ring-2 ring-white/10">
              <Image src={playlist.cover} alt={playlist.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-3xl md:text-4xl font-bold truncate">{playlist.name}</h1>
              <button
                onClick={() => setPlayNow(true)}
                className="mt-3 inline-flex items-center justify-center rounded-3xl bg-white text-black px-5 py-2 shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20"
              >
                Play playlist
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-10 py-8">
        <ul className="space-y-2">
          {tracks.map((t, i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition">
              <div className="relative w-10 h-10 rounded-md overflow-hidden">
                <Image src={t.cover} alt={t.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-white/90 text-sm">{t.title}</div>
                <div className="text-white/60 text-xs">{t.artist}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Player key={playNow ? "playing" : "idle"} queue={tracks} autoPlay={playNow} offsetLeft={280} />
    </main>
  )
}