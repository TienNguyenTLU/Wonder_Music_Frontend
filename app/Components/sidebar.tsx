"use client"
import Link from "next/link"
import AddPlaylistModal from "./AddPlaylistModal"
import { CldImage } from "next-cloudinary"
import { useEffect, useMemo, useState } from "react"
import { Poppins } from "next/font/google"
import { userApi } from "../axios/axios"
import axiosClient from "../axios/axios"
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })
const QUOTES = [
  "Music speaks what cannot be expressed.",
  "Where words fail, music speaks.",
  "Feel the rhythm, live the moment.",
  "Playlist of memories, soundtrack of life.",
  "Turn up the volume on your story."
]
export default function Sidebar() {
  const [name, setName] = useState("Wonder User")
  const [avatar, setAvatar] = useState<string>("/a1.jpeg")
  const [term, setTerm] = useState("")
  const [openPlaylists, setOpenPlaylists] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])
  const [playlists, setPlaylists] = useState<{ id: string; title: string; cover?: string; count?: number }[]>([])
  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    console.log("Sidebar search:", term)
  }

  function logout() {
    localStorage.removeItem("accessToken")
    window.location.href = "/login"
  }
  useEffect(() => {
    userApi.me()
      .then((data: any) => {
        console.log(data)
        if (data?.displayname) setName(data.displayname)
        if (data?.avatarUrl) setAvatar(data.avatarUrl)
      })
      .catch(() => {})
  }, [])

  function loadPlaylists() {
    axiosClient
      .get('/api/playlists/me')
      .then((data: any) => {
        const list = Array.isArray(data) ? data : []
        const mapped = list.map((p: any) => ({
          id: p?.id || p?.name || 'Untitled',
          title: p?.title || p?.name || 'Untitled',
          cover: p?.coverUrl || p?.imageUrl,
          count: p?.tracks?.length || p?.songsCount || undefined,
        }))
        setPlaylists(mapped)
      })
      .catch(() => {})
  }
  useEffect(() => {
    loadPlaylists()
  }, [])
  return (
    <div className={`${poppins.className} w-full h-full max-w-[280px] px-6 py-6 bg-white/10 backdrop-blur-md border border-white/10 flex flex-col gap-6`}>
      <div className="flex items-center gap-4">
        <div
          className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10 cursor-pointer transition-all duration-300 hover:ring-white/30"
          title="Open account menu">
          <CldImage src={avatar} alt="User avatar" fill className="object-cover" />
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
        <button type="button" onClick={() => setOpenAdd(true)} className="w-full inline-flex items-center justify-center rounded-3xl text-white px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-white/20">
          + Add a playlist
        </button>
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
        <div className={`overflow-hidden transition-all duration-300 ${openPlaylists ? "max-h-none" : "max-h-0"}`}>
          <ul className="px-4 pb-3 space-y-2">
            {playlists.map((item, i) => (
              <li key={i} className="flex items-center justify-start px-3 py-2 rounded-xl text-white/90 hover:bg-white/15 transition">
                <Link href={`/home/playlist?id=${encodeURIComponent(item.id)}`} className="flex items-center gap-3 flex-1 truncate">
                  <div className="relative w-8 h-8 rounded-md overflow-hidden">
                    <CldImage src={item.cover || '/1.jpeg'} alt={item.title} fill className="object-cover" />
                  </div>
                  <span className="truncate">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-auto">
        <button onClick={logout} className="w-full inline-flex items-center justify-center gap-2 rounded-3xl text-white px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-white/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Logout
        </button>
      </div>
      <AddPlaylistModal open={openAdd} onOpenChange={setOpenAdd} onCreated={loadPlaylists} />
    </div>
  )
}
