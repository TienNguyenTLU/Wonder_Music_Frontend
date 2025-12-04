"use client"

import { useEffect, useRef, useState } from "react"
import { CldImage } from "next-cloudinary"
import { Poppins } from "next/font/google"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

type Track = {
  src: string
  title: string
  artist: string
  cover: string
}

type PlayerProps = {
  queue?: Track[]
  autoPlay?: boolean
  offsetLeft?: number
}

export default function Player({ queue, autoPlay = false, offsetLeft = 0 }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const hasQueue = Array.isArray(queue) && queue.length > 0
  const track = hasQueue ? queue[index % queue.length] : undefined

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    audio.src = track.src
    audio.load()
    if (autoPlay || playing) {
      audio.play().catch(() => {})
      setPlaying(true)
    } else {
      setPlaying(false)
    }
    setCurrentTime(0)
  }, [index, track?.src])

  useEffect(() => {
    if (autoPlay) setPlaying(true)
  }, [autoPlay])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
  }, [volume])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
    }
  }

  function nextTrack() {
    if (!hasQueue) return
    setIndex((i) => (i + 1) % (queue as Track[]).length)
  }

  function prevTrack() {
    if (!hasQueue) return
    setIndex((i) => (i - 1 + (queue as Track[]).length) % (queue as Track[]).length)
  }

  function onTimeUpdate() {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)
  }

  function onLoaded() {
    const audio = audioRef.current
    if (!audio) return
    setDuration(audio.duration || 0)
  }

  function onEnded() {
    nextTrack()
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current
    if (!audio) return
    const t = Number(e.target.value)
    audio.currentTime = t
    setCurrentTime(t)
  }

  function changeVolume(e: React.ChangeEvent<HTMLInputElement>) {
    setVolume(Number(e.target.value))
  }

  const timeFmt = (s: number) => {
    if (!isFinite(s)) return "0:00"
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  if (!hasQueue || !track) return null

  return (
    <div className={`${poppins.className} fixed bottom-0 right-0 z-50`} style={{ left: offsetLeft }}>
      <div className="w-full px-6 pb-4">
        <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 shadow">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
              <CldImage src={track.cover} alt={track.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white/90 font-semibold truncate">{track.title}</div>
              <div className="text-white/70 text-xs truncate">{track.artist}</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={prevTrack} aria-label="Previous" className="rounded-full bg-white text-black p-2 shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 19V5l-7 7 7 7zM20 19V5l-7 7 7 7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="rounded-full bg-[#e9632c] text-white p-2 shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-[#e9632c]/40">
                {playing ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10 19H7V5h3v14zm7 0h-3V5h3v14z" fill="currentColor"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7-11-7z" fill="currentColor"/></svg>
                )}
              </button>
              <button onClick={nextTrack} aria-label="Next" className="rounded-full bg-white text-black p-2 shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 5v14l7-7-7-7zM4 5v14l7-7-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="text-white/70 text-xs w-10 text-right">{timeFmt(currentTime)}</div>
            <input
              type="range"
              min={0}
              max={Math.max(duration, 0) || 0}
              step={1}
              value={Math.min(currentTime, duration || 0)}
              onChange={seek}
              className="flex-1 h-2 rounded-full appearance-none bg-white/20 accent-[#e9632c]"
            />
            <div className="text-white/70 text-xs w-10">{timeFmt(duration)}</div>

            <div className="flex items-center gap-2 ml-2">
              <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/80" fill="none"><path d="M5 9v6h4l5 5V4l-5 5H5z" fill="currentColor"/></svg>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={changeVolume}
                className="w-24 h-2 rounded-full appearance-none bg-white/20 accent-[#e9632c]"
              />
            </div>
          </div>

          <audio
            ref={audioRef}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoaded}
            onEnded={onEnded}
            preload="metadata"
          />
        </div>
      </div>
    </div>
  )
}
