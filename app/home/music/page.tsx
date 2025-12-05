"use client"

import { useEffect, useState } from "react"
import axiosClient from "../../axios/axios"
import Sidebar from "../../Components/sidebar"
import Player from "../../Components/player"
import Protector from "../../Components/Protector"
import { CldImage } from "next-cloudinary"
import Link from "next/link"
import { Play } from "lucide-react"

export default function MusicDashboard() {
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Player state for quick play
  const [queue, setQueue] = useState<any[]>([])
  const [autoPlay, setAutoPlay] = useState(false)
  const [playKey, setPlayKey] = useState("")

  useEffect(() => {
    axiosClient.get("/api/songs").then((res: any) => {
        const list = Array.isArray(res) ? res : (res?.data || [])
        setSongs(list)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function play(song: any) {
    setQueue([{
        src: song.fileUrl,
        title: song.title || song.songName,
        artist: song.artistName || song.artist?.name || "Unknown",
        cover: song.coverUrl || song.songCoverUrl || "/1.jpeg"
    }])
    setAutoPlay(true)
    setPlayKey(Math.random().toString())
  }

  const featured = songs.slice(0, 6) // Mock featured
  const newest = [...songs].sort((a, b) => 
    new Date(b.createdAt || b.songCreatedAt).getTime() - new Date(a.createdAt || a.songCreatedAt).getTime()
  ).slice(0, 6)

  const Section = ({ title, items, link }: { title: string, items: any[], link: string }) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Link href={link} className="text-sm font-semibold text-white/60 hover:text-white hover:underline transition">
          View More
        </Link>
      </div>
      
      {items.length === 0 && !loading && <div className="text-white/50">No songs found.</div>}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {items.map((song, i) => (
          <div 
            key={song.id || i}
            className="group bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition duration-300 cursor-pointer flex flex-col"
            onClick={() => play(song)}
          >
            <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4 shadow-lg">
              <CldImage 
                src={song.coverUrl || song.songCoverUrl || "/1.jpeg"} 
                alt={song.title || "Song"} 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center translate-y-2 group-hover:translate-y-0">
                <div className="bg-green-500 rounded-full p-3 shadow-xl hover:scale-105 transition transform">
                  <Play fill="black" className="text-black ml-1" width={20} height={20} />
                </div>
              </div>
            </div>
            <div className="min-h-[48px]">
              <h3 className="font-bold text-white truncate mb-1" title={song.title || song.songName}>
                {song.title || song.songName}
              </h3>
              <p className="text-sm text-[#a7a7a7] truncate line-clamp-2">
                {song.artistName || song.artist?.name || "Unknown Artist"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Protector>
      <div className="w-full min-h-screen bg-[#121212] text-white pl-[280px] pb-28">
        <div className="fixed top-0 left-0 h-full w-[280px]">
          <Sidebar />
        </div>
        
        <div className="p-8 pt-10">
          <h1 className="text-4xl font-bold mb-10">Music Library</h1>
          
          <Section title="Featured Tracks" items={featured} link="/home/music/featured" />
          <Section title="Newest Tracks" items={newest} link="/home/music/newest" />
        </div>

        <Player key={playKey} queue={queue} autoPlay={autoPlay} offsetLeft={280} />
      </div>
    </Protector>
  )
}
