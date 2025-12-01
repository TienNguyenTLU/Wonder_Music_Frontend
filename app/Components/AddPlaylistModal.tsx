"use client"

import * as Dialog from "@radix-ui/react-dialog"
import * as Switch from "@radix-ui/react-switch"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axiosClient from "../axios/axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

// 1. Helper validate file: Chấp nhận any trước, sau đó mới check kỹ
// Lý do: FileList khó tính trong TypeScript/SSR
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const imageFileSchema = (required: boolean) =>
  z.custom<FileList>()
    .refine((files) => {
      if (!required) return true // Không bắt buộc -> Cho qua
      return files instanceof FileList && files.length > 0
    }, "Cover image is required")
    .refine((files) => {
      if (!files || files.length === 0) return true
      return ACCEPTED_IMAGE_TYPES.includes(files[0].type)
    }, "File must be an image (jpg, png, webp)")
    .refine((files) => {
      if (!files || files.length === 0) return true
      return files[0].size <= MAX_FILE_SIZE
    }, "Image must be smaller than 5MB")

// 2. Định nghĩa Schema
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional().or(z.literal("")),
  // .default(true) giúp giải quyết lỗi "boolean | undefined"
  public: z.boolean().default(true),
  cover: imageFileSchema(true),
  wallpaper: imageFileSchema(false).optional(),
})

type FormValues = z.infer<typeof schema>

export default function AddPlaylistModal({ open, onOpenChange, onCreated }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter() // Để refresh dữ liệu sau khi tạo

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      public: true, // Giá trị mặc định khớp với schema
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setSubmitting(true)
      const fd = new FormData()
      // --- 1. XỬ LÝ PHẦN JSON (PlaylistDTO) ---
      // Tạo object chứa dữ liệu text
      const playlistData = {
          name: values.name,
          description: values.description || "",
          // Gửi true/false (Spring Boot tự hiểu), hoặc 1/0 nếu thích
          isPublic: values.public 
      };
      // QUAN TRỌNG: Ép kiểu nó thành Blob JSON
      const jsonBlob = new Blob([JSON.stringify(playlistData)], {
          type: 'application/json' 
      });
      // Append vào FormData với tên key là "playlist" (Khớp với @RequestPart backend)
      fd.append("playlist", jsonBlob);
      // --- 2. XỬ LÝ FILE ẢNH ---
      if (values.cover && values.cover.length > 0) {
        fd.append("cover", values.cover[0]) // Key "cover" khớp BE
      }
      if (values.wallpaper && values.wallpaper.length > 0) {
        fd.append("wallpaper", values.wallpaper[0]) // Key "wallpaper" khớp BE
      }
      // --- 3. GỬI REQUEST ---
      await axiosClient.post("/api/playlists", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Playlist created")
      // ... Reset form, đóng modal ...
      reset()
      onOpenChange(false)
      router.refresh() // Refresh dữ liệu ở HomePlaylists
      onCreated?.()
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to create playlist"
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
          <Dialog.Title className="text-xl font-bold">Create Playlist</Dialog.Title>
          <Dialog.Description className="text-sm text-zinc-400 mt-1 mb-5">
            Add a new playlist to your library.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                placeholder="My Playlist"
              />
              {/* Sửa lỗi hiển thị: Dùng optional chaining */}
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea
                {...register("description")}
                className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
                placeholder="Describe your playlist"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Cover File */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Cover Image <span className="text-red-500">*</span></label>
              <input
                type="file"
                accept="image/*"
                {...register("cover")}
                className="block w-full text-sm text-zinc-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-zinc-700 file:text-white
                  hover:file:bg-zinc-600 cursor-pointer"
              />
              {errors.cover && <p className="mt-1 text-xs text-red-400">{errors.cover.message}</p>}
            </div>

            {/* Wallpaper File */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Wallpaper (Optional)</label>
              <input
                type="file"
                accept="image/*"
                {...register("wallpaper")}
                className="block w-full text-sm text-zinc-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-zinc-700 file:text-white
                  hover:file:bg-zinc-600 cursor-pointer"
              />
              {errors.wallpaper && (
                <p className="mt-1 text-xs text-red-400">{errors.wallpaper.message}</p>
              )}
            </div>

            {/* Public Switch */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Public Playlist</span>
              <Controller
                name="public"
                control={control}
                render={({ field }) => (
                  <Switch.Root
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="w-11 h-6 bg-zinc-700 rounded-full relative data-[state=checked]:bg-green-500 outline-none cursor-pointer transition"
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                  </Switch.Root>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium rounded-md text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-sm font-bold rounded-md bg-green-500 text-black hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
