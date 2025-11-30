'use client'
import { Poppins } from 'next/font/google'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { CldImage } from 'next-cloudinary'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })

const artistNames = ['The Fat Rat', 'Charlie Puth', 'The Weeknd', 'Shawn Mendes', 'Max Ozao', 'Alan Walker']
const avatars = ['/a1.jpeg', '/a2.jpg', '/a3.jpg', '/a4.jpg', '/a5.jpg', '/a6.jpg']

export default function FeatureArtist() {
  return (
    <section className={`${poppins.className} mx-auto max-w-6xl px-6`}>
        <h2 className="text-white text-3xl font-bold text-center mb-8">Feature Artists on Wonder Music</h2>
      <div className="w-full px-6">
        <Swiper modules={[Autoplay]} autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }} loop={true} slidesPerView={5}>
          {avatars.map((src, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-36 h-36 rounded-full overflow-hidden">
                  <CldImage src={src} alt={`Artist ${i + 1}`} fill className="object-cover" />
                </div>
                <div className="text-white text-sm">{artistNames[i]}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
