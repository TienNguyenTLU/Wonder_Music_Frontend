"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axiosClient, { userApi } from "../../../axios/axios"
import Sidebar from "../../../Components/sidebar"
import Player from "../../../Components/player"
import Protector from "../../../Components/Protector"
import { CldImage } from "next-cloudinary"
import { toast } from "sonner"
import { jwtDecode } from "jwt-decode"

export default function ArtistDetail() {
  const params = useParams()
  const id = params.id
  const [artist, setArtist] = useState<any>(null)
  const [songs, setSongs] = useState<any[]>([])
  const [queue, setQueue] = useState<any[]>([])
  const [autoPlay, setAutoPlay] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [followerCount, setFollowerCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
        const id = jwtDecode(token)?.jti as string
        console.log("ID" ,id)
        setUserId(id)
    }
  }, [])

  useEffect(() => {
    if (!id) return
    axiosClient.get(`/api/artists/${id}`).then((res: any) => {
        setArtist(res?.data || res)
    }).catch(() => {})
    axiosClient.get(`/api/songs/artist/${id}`).then((res: any) => {
        const list = Array.isArray(res) ? res : (res?.data || [])
        setSongs(list)
    }).catch(() => {})
    fetchFollowers()
  }, [id])

  useEffect(() => {
    if (userId && id) {
        checkIfFollowing()
    }
  }, [userId, id])

  function fetchFollowers() {
      if (!id) return
      axiosClient.get(`/api/follows/artist/${id}`).then((res: any) => {
          const list = Array.isArray(res) ? res : (res?.data || [])
          setFollowerCount(list.length)
      }).catch(() => setFollowerCount(0))
  }

  function checkIfFollowing() {
    axiosClient.get(`/api/follows/artist/${id}`).then((res: any) => {
        const data = res
        const list = Array.isArray(data) ? data : (data?.data || [])
        // Convert both IDs to strings for safe comparison
        const check = list.some((f: any) => String(f.user.id) === String(userId))
        setIsFollowing(check)
    }).catch(() => setIsFollowing(false))
  }

  function play(index: number) {
    const mapped = songs.map(s => ({
        src: s.fileUrl,
        title: s.songName || s.title,
        artist: s.artistName || artist?.name || "Unknown",
        cover: s.songCoverUrl || s.coverUrl || "/1.jpeg"
    })).filter(t => t.src)
    
    if (!mapped.length) return
    const q = [...mapped.slice(index), ...mapped.slice(0, index)]
    setQueue(q)
    setAutoPlay(true)
  }

  function fmtDuration(s: number) {
      if (!s) return "--:--"
      const m = Math.floor(s / 60)
      const sec = Math.floor(s % 60)
      return `${m}:${sec.toString().padStart(2, '0')}`
  }

  function handleFollow() {
    console.log(userId, id)
    if (!userId) {
        toast.error("Please login to follow")
        return
    }
    if (isFollowing) {
        axiosClient.delete(`/api/follows?userId=${userId}&artistId=${id}`).then(() => {
            toast.success("Unfollowed artist successfully")
            setIsFollowing(false)
            fetchFollowers()
        }).catch((err) => {
            toast.error(err?.response?.data?.message || "Failed to unfollow artist")
        })
    } else {
        // Handle follow
        axiosClient.post("/api/follows", {
            userId: userId,
            artistId: id
        }).then(() => {
            toast.success("Followed artist successfully")
            setIsFollowing(true)
            fetchFollowers()
        }).catch((err) => {
            toast.error(err?.response?.data?.message || "Failed to follow artist")
        })
    }
  }
  if (!artist) return null
  return (
    <Protector>
      <div className="w-full min-h-screen bg-[#121212] text-white pl-[280px] pb-28">
        <div className="fixed top-0 left-0 h-full w-[280px]">
          <Sidebar />
        </div>
        
        <div className="flex h-[calc(100vh-112px)]">
          {/* Left Panel: Artist Info */}
          <div className="w-1/3 h-full p-8 border-r border-white/10 flex flex-col items-center text-center gap-6 sticky top-0 overflow-y-auto custom-scrollbar">
              <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/10 shrink-0">
                  <CldImage 
                      src={artist.avatarUrl} 
                      alt={artist.name} 
                      fill 
                      className="object-cover"
                  />
              </div>
              <div>
                  <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
                  <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
                    {artist.bio || "No biography available for this artist."}
                </p>
                <button 
                    onClick={handleFollow}
                    className={`mt-4 px-8 py-2 rounded-full font-bold hover:scale-105 transition transform ${
                        isFollowing 
                        ? "bg-transparent border border-white text-white hover:bg-white/10" 
                        : "bg-white text-black"
                    }`}
                >
                    {isFollowing ? "Followed" : "Follow"}
                </button>
            </div>
              <div className="mt-auto w-full">
                  <div className="grid grid-cols-2 gap-4 text-center bg-white/5 p-4 rounded-xl">
                      <div>
                          <div className="text-2xl font-bold">{songs.length}</div>
                          <div className="text-xs text-white/50 uppercase tracking-wider">Songs</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{followerCount}</div>
                        <div className="text-xs text-white/50 uppercase tracking-wider">Followers</div>
                    </div>
                  </div>
              </div>
          </div>

          {/* Right Panel: Songs List */}
          <div className="flex-1 h-full overflow-y-auto p-8 custom-scrollbar">
              <h2 className="text-2xl font-bold mb-6">{artist.name}'s Tracks</h2>
              <div className="space-y-2">
                  {songs.map((song, i) => (
                      <div 
                          key={song.id || i}
                          className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition cursor-pointer"
                          onClick={() => play(i)}
                      >
                          <div className="text-white/50 w-6 text-center">{i + 1}</div>
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                              <CldImage 
                                  src={song.coverUrl} 
                                  alt={song.songName} 
                                  fill 
                                  className="object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7-11-7z"/></svg>
                              </div>
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="font-medium truncate text-white/90">{song.songName || song.title}</div>
                              <div className="text-xs text-white/50 truncate">{artist.name}</div>
                          </div>
                          <div className="text-sm text-white/50">{fmtDuration(song.duration)}</div>
                      </div>
                  ))}
                  {songs.length === 0 && (
                      <div className="text-white/50 italic">No songs found for this artist.</div>
                  )}
              </div>
          </div>
        </div>

        <Player queue={queue} autoPlay={autoPlay} offsetLeft={280} />
      </div>
    </Protector>
  )
}
