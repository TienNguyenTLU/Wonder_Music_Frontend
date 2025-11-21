"use client"
import Link from "next/link"
import Image from "next/image"
import { useMemo, useState } from "react"
import { Poppins } from "next/font/google"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

const QUOTES = [
  "Music speaks what cannot be expressed.",
  "Where words fail, music speaks.",
  "Feel the rhythm, live the moment.",
  "Playlist of memories, soundtrack of life.",
  "Turn up the volume on your story."
]

export default function Sidebar() {
  const [name] = useState("Wonder User")
  const [term, setTerm] = useState("")
  const [openPlaylists, setOpenPlaylists] = useState(true)
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])
    const playlists
    = [
        {title: "My Playlist", cover: "/playlist1.jpg"},
        {title: "Liked Songs", cover: "/liked.jpg"},
        {title: "Recents", cover: "/recents.jpg"},
        {title: "New Releases", cover: "/new-releases.jpg"},
    ]
  const RECENTS = [
    { src: "/track1.jpg", title: "Clair Obscur E33", artist: "Lorien Testard" },
    { src: "/track2.jpg", title: "Let me love you", artist: "Justin Bieber" },
    { src: "/track3.jpg", title: "Waiting for love", artist: "Avicii" },
    { src: "/track4.jpg", title: "The Night", artist: "Avicii" },
    { src: "/track5.jpg", title: "We dont talk any more", artist: "Charlie Puth" }
  ]

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    console.log("Sidebar search:", term)
  }

  return (
    <div className={`${poppins.className} w-full h-full max-w-[280px] px-6 py-6 space-y-8 bg-white/10 backdrop-blur-md border border-white/10 `}>
      <div className="flex items-center gap-4">
        <div
          className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10 cursor-pointer"
          title="Open account menu"
          onClick={() => window.dispatchEvent(new Event("account-overlay-open"))}
        >
          <Image src="/a1.jpeg" alt="User avatar" fill className="object-cover" />
        </div>
        <div className="flex-1">
          <div className="text-white/90 font-semibold">{name}</div>
          <div className="text-white/70 text-xs mt-1">{quote}</div>
        </div>
      </div>
      <form onSubmit={onSearch} className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/70">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search your library"
          className="w-full rounded-3xl bg-white text-black pl-10 pr-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-black/20"
        />
      </form>
      <div>
        <a href="/explore" className="w-full rounded-3xl px-4 py-2 hover:bg-white/15 transition">
          Explore
        </a>
      </div>
      <div className="">
        <button type="button" onClick={() => setOpenPlaylists((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 text-white/90">
          <span>Your playlists</span>
          <span className={`transition-transform ${openPlaylists ? "rotate-180" : "rotate-0"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${openPlaylists ? "max-h-64" : "max-h-0"}`}>
          <ul className="px-4 pb-3 space-y-2">
            {playlists.map((item, i) => (
              <li key={i} className="flex items-center justify-between px-3 py-2 rounded-xl text-white/90 hover:bg-white/15 transition">
                <a href=""><span>{item.title}</span></a>
                <span className="text-white/60 text-xs">24 songs</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-white/80 text-sm">Recent songs</div>
        <ul className="space-y-2">
          {RECENTS.map((item, i) => (
            <li key={i} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/10 transition">
              <div className="relative w-8 h-8 rounded-md overflow-hidden">
                <Image src={item.src} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-white/90 text-sm">{item.title}</div>
                <div className="text-white/60 text-xs">{item.artist}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}