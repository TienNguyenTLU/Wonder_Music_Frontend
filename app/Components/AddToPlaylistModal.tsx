"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import axiosClient from "../axios/axios"
import { toast } from "sonner"
import { CldImage } from "next-cloudinary"
import { Plus } from "lucide-react"

type Props = {
  songId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddToPlaylistModal({ songId, open, onOpenChange }: Props) {
  const [playlists, setPlaylists] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setLoading(true)
      axiosClient.get('/api/playlists/me')
        .then((res: any) => {
          const list = Array.isArray(res) ? res : (res?.data || [])
          setPlaylists(list)
        })
        .catch(() => toast.error("Failed to load playlists"))
        .finally(() => setLoading(false))
    }
  }, [open])

  const handleAdd = async (playlistId: string) => {
    if (!songId) return
    try {
      await axiosClient.post(`/api/playlist-songs`, { 
        playlistId, 
        songId 
      })
      toast.success("Added to playlist")
      onOpenChange(false)
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to add to playlist"
      toast.error(msg)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#1e1e1e] text-white border border-white/10 p-6 shadow-xl focus:outline-none">
          <Dialog.Title className="text-xl font-bold mb-4">Add to Playlist</Dialog.Title>
          
          <div className="max-h-[60vh] overflow-y-auto space-y-2 custom-scrollbar">
            {loading ? (
              <div className="text-center text-white/50 py-4">Loading...</div>
            ) : playlists.length === 0 ? (
              <div className="text-center text-white/50 py-4">No playlists found</div>
            ) : (
              playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleAdd(p.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition text-left group"
                >
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-white/5">
                    <CldImage 
                      src={p.coverUrl || p.imageUrl || "/1.jpeg"} 
                      alt={p.name || p.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{p.name || p.title}</div>
                    <div className="text-xs text-white/50">{p.songsCount || 0} songs</div>
                  </div>
                  <Plus className="opacity-0 group-hover:opacity-100 text-white/70" width={20} />
                </button>
              ))
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-sm font-medium rounded-full bg-white/10 hover:bg-white/20 transition">
                Cancel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
