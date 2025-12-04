"use client"
import Link from "next/link"
import AddPlaylistModal from "./AddPlaylistModal"
import { CldImage } from "next-cloudinary"
import { useEffect, useMemo, useState } from "react"
import { Poppins } from "next/font/google"
import { userApi } from "../axios/axios"
import axiosClient from "../axios/axios"
import { Home, Music, Mic2, UploadCloud } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
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
  const [openAdd, setOpenAdd] = useState(false)
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])
  const [playlists, setPlaylists] = useState<{ id: string; title: string; cover?: string; count?: number }[]>([])
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function logout() {
    localStorage.removeItem("accessToken")
    window.location.href = "/login"
  }
  useEffect(() => {
    userApi.me()
      .then((data: any) => {

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
        const mapped = list.map((p: any) => {
          const coverRaw = p?.coverUrl || p?.imageUrl || ''
          const cover = typeof coverRaw === 'string' ? coverRaw.replace(/[`]/g, '').trim() : coverRaw
          return {
            id: p?.id || p?.name || 'Untitled',
            title: p?.title || p?.name || 'Untitled',
            cover,
            count: p?.tracks?.length || p?.songsCount || undefined,
          }
        })
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
      <nav className="space-y-2">
        <Link href="/home" className={`w-full flex items-center gap-3 px-4 py-2 rounded-2xl transition ${pathname === "/home" && !searchParams.get("tab") ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/15"}`}>
          <Home width={18} height={18} />
          <span className="text-sm">Home</span>
        </Link>
        <Link href={{ pathname: "/home", query: { tab: "music" } }} className={`w-full flex items-center gap-3 px-4 py-2 rounded-2xl transition ${searchParams.get("tab") === "music" ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/15"}`}>
          <Music width={18} height={18} />
          <span className="text-sm">Music</span>
        </Link>
        <Link href={{ pathname: "/home", query: { tab: "artists" } }} className={`w-full flex items-center gap-3 px-4 py-2 rounded-2xl transition ${searchParams.get("tab") === "artists" ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/15"}`}>
          <Mic2 width={18} height={18} />
          <span className="text-sm">Artists</span>
        </Link>
        <Link href="/home/upload" className={`w-full flex items-center gap-3 px-4 py-2 rounded-2xl transition ${pathname === "/home/upload" ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/15"}`}>
          <UploadCloud width={18} height={18} />
          <span className="text-sm">Your Upload</span>
        </Link>
      </nav>
      <div>
        <button type="button" onClick={() => setOpenAdd(true)} className="w-full inline-flex items-center justify-center rounded-3xl text-white px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-white/20">
          + Add a playlist
        </button>
      </div>
      <div className="">
        <div className="w-full flex items-center justify-between px-4 py-3 text-white/90">
          <span>Your playlists</span>
        </div>
        <ul className="px-4 pb-3 space-y-2">
          {playlists.map((item, i) => {
            const isActive = pathname?.startsWith("/home/playlist") && searchParams.get("id") === String(item.id)
            return (
              <li key={i} className={`flex items-center justify-start px-3 py-2 rounded-xl transition ${isActive ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/15"}`}>
                <Link href={`/home/playlist?id=${(item.id)}`} className="flex items-center gap-3 flex-1 truncate">
                  <div className="relative w-8 h-8 rounded-md overflow-hidden">
                    <CldImage src={item.cover || '/1.jpeg'} alt={item.title} fill className="object-cover" />
                  </div>
                  <span className="truncate text-sm">{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="mt-auto">
        <button onClick={logout} className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#242424] text-white px-2 py-3 cursor-pointer transition-all duration-300 hover:bg-[#343434]">
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
