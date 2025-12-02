"use client"
import { useEffect, useMemo, useState } from "react"
import { CldImage } from "next-cloudinary"
import { Poppins } from "next/font/google"
import axiosClient from "../../axios/axios"
import Sidebar from "../../Components/sidebar"
import Player from "../../Components/player"
import Link from "next/link"
import { toast } from "sonner"
import AddSongModal from "../../Components/AddSongModal"
import { jwtDecode } from "jwt-decode";
import Protector from "@/app/Components/Protector"
import { PlusIcon } from "lucide-react"
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

export default function UploadPage() {
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [playNow, setPlayNow] = useState(false)
  const [queue, setQueue] = useState<any[]>([])
  const [openAdd, setOpenAdd] = useState(false)
  const safeSrc = (s?: any) => {
    const v = typeof s === "string" ? s.trim() : ""
    return v || "https://res.cloudinary.com/demo/image/upload/sample"
  }
  const jwt_Decode = jwtDecode
  const getUserID = () => {
    const token = localStorage.getItem("accessToken")
    if (!token) return ""
    try {
    const decoded = jwt_Decode(token);
    return decoded.sub
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    return null;
  }
  }
  function loadSongs() {
    setLoading(true)
    console.log(getUserID())
    axiosClient
      .get(`/api/songs/user/${getUserID()}`)
      .then((res: any) => {
        const list = Array.isArray(res) ? res : []
        setSongs(list)
        setError("")
      })
      .catch(() => setError("Failed to load your songs"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSongs()
  }, [])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(songs.length / pageSize)), [songs.length])
  const paged = useMemo(() => songs.slice((page - 1) * pageSize, page * pageSize), [songs, page])

  function startPlay(list: any[], startIndex = 0) {
    const mapped = list.map((s) => ({ src: s?.fileUrl || "", title: s?.title || "Untitled", artist: s?.artist.name || "Unknown", cover: safeSrc(s?.coverUrl) }))
    const q = [...mapped.slice(startIndex), ...mapped.slice(0, startIndex)]
    setQueue(q)
    setPlayNow(true)
  }

  async function deleteSong(s: any) {
    const id = s?.id ?? s?.songId
    if (!id) return
    try {
      await axiosClient.delete(`/api/songs/${id}`)
      toast.success("Deleted")
      loadSongs()
    } catch {
      toast.error("Delete failed")
    }
  }

  return (
    <Protector>
        <AddSongModal open={openAdd} onOpenChange={setOpenAdd} onCreated={loadSongs} />
    <main className={`${poppins.className} w-full min-h-screen pb-28 pl-[280px]`}>
      <div className="fixed top-0 left-0 h-full w-[280px]">
        <Sidebar />
      </div>
      <section className="relative w-full">
        <div className="px-8 pt-6 flex items-center justify-between">
          <h1 className="text-white text-3xl font-bold">Your Uploads</h1>
          <button onClick={() => setOpenAdd(true)} className="inline-flex items-center justify-center rounded-3xl bg-white text-black px-4 py-2 text-sm shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20"><PlusIcon className="w-5 h-5 mr-1" />Add music</button>
        </div>
      </section>
      <section className="w-full px-8 py-6">
        <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
          <div className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_2fr_1fr_120px_120px] px-4 py-3 text-white/70 text-xs">
            <div>#</div>
            <div>Title</div>
            <div className="hidden md:block">Artist</div>
            <div className="hidden md:block text-right">Duration</div>
            <div className="hidden md:block text-right">Action</div>
          </div>
          {error && <div className="px-4 py-3 text-red-500 text-sm">{error}</div>}
          {loading ? (
            <div className="px-4 py-6 text-white/70 text-sm">Loading...</div>
          ) : (
            <ul>
              {paged.map((t: any, i: number) => (
                <li key={`${t.id ?? i}`} className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_2fr_1fr_120px_120px] items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition">
                  <div className="text-white/60 text-sm">{(page - 1) * pageSize + i + 1}</div>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden">
                      <CldImage src={safeSrc(t?.coverUrl)} alt={t?.title ||"Untitled"} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => startPlay(paged, i)}
                        className="absolute bottom-1 right-1 rounded-full bg-white text-black p-1 shadow"
                        aria-label="Play"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7-11-7z" fill="currentColor"/></svg>
                      </button>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm truncate">{t?.title || t?.songName || "Untitled"}</div>
                      <div className="md:hidden text-white/60 text-xs truncate">{t?.artist.name || "Unknown"}</div>
                    </div>
                  </div>
                  <div className="hidden md:block text-white/70 text-sm truncate">{t?.artist.name || "Unknown"}</div>
                  <div className="hidden md:block text-right text-white/60 text-sm">{typeof t?.duration === "number" ? `${Math.floor(t.duration/60)}:${Math.floor(t.duration%60).toString().padStart(2,"0")}` : "—"}</div>
                  <div className="hidden md:flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => deleteSong(t)}
                      className="rounded-3xl bg-white text-black px-3 py-1.5 text-sm shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 px-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center justify-center rounded-2xl bg-white text-black px-3 py-1.5 text-sm shadow disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-white/80 text-sm">Page {page} / {totalPages}</div>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center justify-center rounded-2xl bg-white text-black px-3 py-1.5 text-sm shadow disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
        
      <Player key={playNow ? "playing" : "idle"} queue={queue.length ? queue : undefined} autoPlay={playNow} offsetLeft={280} />
    </main>
    </Protector>
  )
}

