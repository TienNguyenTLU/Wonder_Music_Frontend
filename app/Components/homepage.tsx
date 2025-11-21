"use client"

import Image from "next/image"
import { Poppins } from "next/font/google"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

const categories = [
  { name: "Pop", src: "/track1.jpg" },
  { name: "EDM", src: "/track2.jpg" },
  { name: "Hip-Hop", src: "/track3.jpg" },
  { name: "R&B", src: "/track4.jpg" },
  { name: "Indie", src: "/track5.jpg" },
  { name: "Rock", src: "/1.jpeg" },
  { name: "Lo-Fi", src: "/2.jpeg" },
  { name: "House", src: "/3.jpeg" },
  { name: "Jazz", src: "/a.jpg" },
  { name: "Classical", src: "/b.jpg" },
]

const playlists = [
  { title: "Daily Mix", cover: "/1.jpeg" },
  { title: "Chill Vibes", cover: "/2.jpeg" },
  { title: "Workout", cover: "/3.jpeg" },
  { title: "Discover Weekly", cover: "/track1.jpg" },
]

const recommended = [
  { title: "Clair Obscur E33", artist: "Lorien Testard", cover: "/track1.jpg" },
  { title: "Let me love you", artist: "Justin Bieber", cover: "/track2.jpg" },
  { title: "Waiting for love", artist: "Avicii", cover: "/track3.jpg" },
  { title: "The Night", artist: "Avicii", cover: "/track4.jpg" },
  { title: "We dont talk any more", artist: "Charlie Puth", cover: "/track5.jpg" },
  { title: "Editor’s Choice", artist: "Various", cover: "/a.jpg" },
]

const favArtistNew = [
  { name: "The Weeknd", cover: "/a3.jpg" },
  { name: "Charlie Puth", cover: "/a2.jpg" },
  { name: "Alan Walker", cover: "/a6.jpg" },
  { name: "Shawn Mendes", cover: "/a4.jpg" },
]

const featurePlaylists = [
  { title: "Top 50 Global", cover: "/b.jpg" },
  { title: "Fresh Finds", cover: "/c.jpg" },
  { title: "Viral Hits", cover: "/d.jpg" },
  { title: "Throwbacks", cover: "/e.jpg" },
]

export default function Homepage() {
  return (
    <main className={`${poppins.className} w-full`}>
      <div className="w-full px-10 py-10 space-y-12">
        <section className="space-y-4">
          <h2 className="text-white text-3xl font-bold">Explore your music journey</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="relative w-full aspect-square rounded-2xl overflow-hidden">
                <Image src={cat.src} alt={cat.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-white text-sm font-semibold">{cat.name}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-white text-3xl font-bold">Your playlist</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {playlists.map((pl, i) => (
              <div key={i} className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
                <div className="relative w-full aspect-[4/3]">
                  <Image src={pl.cover} alt={pl.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-white text-sm font-semibold">{pl.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-white text-3xl font-bold">Recommend for you</h2>
          <Swiper modules={[Autoplay, Navigation]} navigation autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }} loop spaceBetween={16} slidesPerView={3} breakpoints={{ 768: { slidesPerView: 4 }, 1024: { slidesPerView: 6 } }}>
            {recommended.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
                  <div className="relative w-full aspect-[4/3]">
                    <Image src={item.cover} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="text-white text-sm font-semibold">{item.title}</div>
                    <div className="text-white/70 text-xs">{item.artist}</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section className="space-y-4">
          <h2 className="text-white text-3xl font-bold">New from your favourite artist</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favArtistNew.map((it, i) => (
              <div key={i} className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
                <div className="relative w-full aspect-[4/3]">
                  <Image src={it.cover} alt={it.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-white text-sm font-semibold">{it.name}</div>
                  <div className="text-white/70 text-xs">New release</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-white text-3xl font-bold">Feature playlist</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featurePlaylists.map((fp, i) => (
              <div key={i} className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
                <div className="relative w-full aspect-[4/3]">
                  <Image src={fp.cover} alt={fp.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-white text-sm font-semibold">{fp.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}