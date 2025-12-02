"use client"
import * as Dialog from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axiosClient from "../axios/axios"
import { toast } from "sonner"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

const MAX_IMAGE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const imageFileSchema = z
  .custom<FileList>()
  .refine((files) => files instanceof FileList && files.length > 0, "Cover is required")
  .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files[0].type), "Invalid image type")
  .refine((files) => files[0].size <= MAX_IMAGE, "Image must be <= 5MB")

const audioFileSchema = z
  .custom<FileList>()
  .refine((files) => files instanceof FileList && files.length > 0, "Audio file is required")
  .refine((files) => files[0].type === "audio/mpeg" || files[0].name.toLowerCase().endsWith(".mp3"), "File must be MP3")

const schema = z.object({
  title: z.string().min(2, "Title too short").max(200, "Title too long"),
  description: z.string().max(500).optional().or(z.literal("")),
  artistId: z.string().min(1, "Artist is required"),
  genreId: z.string().min(1, "Genre is required"),
  cover: imageFileSchema,
  file: audioFileSchema,
})

type FormValues = z.infer<typeof schema>

export default function AddSongModal({ open, onOpenChange, onCreated }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [artists, setArtists] = useState<any[]>([])
  const [genres, setGenres] = useState<any[]>([])

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    mode: "onChange",
    defaultValues: { title: "", description: "", artistId: "", genreId: "" } as any,
  })

  useEffect(() => {
    axiosClient.get("/api/artists").then((res: any) => {
      setArtists(Array.isArray(res) ? res : [])
    }).catch(() => {})
    axiosClient.get("/api/genres").then((res: any) => {
      setGenres(Array.isArray(res) ? res : [])
    }).catch(() => {})
  }, [])

  async function onSubmit(values: FormValues) {
    try {
      setSubmitting(true)
      const fd = new FormData()
      const payload = { title: values.title, description: values.description || "", artistId: values.artistId, genreId: (values as any).genreId }
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" })
      fd.append("song", blob)
      fd.append("image", values.cover[0])
      fd.append("file", values.file[0])
      console.log(payload)
      await axiosClient.post("/api/songs", fd, { headers: { "Content-Type": "multipart/form-data" } })
      toast.success("Song created")
      reset()
      onOpenChange(false)
      onCreated?.()
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to create song"
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-zinc-900 text-white border border-white/10 p-6 shadow-xl focus:outline-none">
          <Dialog.Title className="text-xl font-bold">Add Song</Dialog.Title>
          <Dialog.Description className="text-sm text-zinc-400 mt-1 mb-5">Upload a new song to your library.</Dialog.Description>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title</label>
              <input type="text" {...register("title")} className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition" placeholder="Song title" />
              {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea {...register("description")} className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none" placeholder="Describe your song" />
              {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message as any}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Artist</label>
              <Controller name="artistId" control={control} render={({ field }) => (
                <select {...field} className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition">
                  <option value="">Select an artist</option>
                  {artists.map((a: any) => (
                    <option key={a.id ?? a.name} value={String(a.id ?? a.name)}>{a.name}</option>
                  ))}
                </select>
              )} />
              {errors.artistId && <p className="mt-1 text-xs text-red-400">{errors.artistId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Genre</label>
              <Controller name="genreId" control={control} render={({ field }) => (
                <select {...field} className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition">
                  <option value="">Select a genre</option>
                  {genres.map((g: any) => (
                    <option key={g.id} value={String(g.id)}>{g.name}</option>
                  ))}
                </select>
              )}/>
              {errors.genreId && <p className="mt-1 text-xs text-red-400">{errors.genreId.message}</p>} 
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Cover Image</label>
              <input type="file" accept="image/*" {...register("cover")} className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-700 file:text-white hover:file:bg-zinc-600 cursor-pointer" />
              {errors.cover && <p className="mt-1 text-xs text-red-400">{errors.cover.message as any}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">MP3 File</label>
              <input type="file" accept="audio/mpeg" {...register("file")} className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-700 file:text-white hover:file:bg-zinc-600 cursor-pointer" />
              {errors.file && <p className="mt-1 text-xs text-red-400">{errors.file.message as any}</p>}
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-zinc-800 transition">Cancel</button>
              </Dialog.Close>
              <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-bold rounded-md bg-green-500 text-black hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition">{submitting ? "Creating..." : "Create"}</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

