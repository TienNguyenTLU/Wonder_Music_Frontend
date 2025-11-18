'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })

type Slide = { src: string; title: string; desc: string }

type CarouselProps = {
  items?: Slide[]
  intervalMs?: number
}

export default function Carousel({
  items = [
    { src: '/1.jpeg', title: 'Discover. Get Discovered.', desc: 'Discover your next obsession, or become someone else’s. SoundCloud is the only community where fans and artists come together to discover and connect through music.' },
    { src: '/2.jpeg', title: 'It all starts with an upload.', desc: 'From bedrooms and broom closets to studios and stadiums, SoundCloud is where you define what’s next in music. Just hit upload.' },
    { src: '/3.jpeg', title: 'Where every music scene lives.', desc: 'Discover 400 million songs, remixes and DJ sets: every chart-topping track you can find elsewhere, and millions more you can’t find anywhere else.' },
  ],
  intervalMs = 3000,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' })

  useEffect(() => {
    if (!emblaApi) return
    let timer = setInterval(() => emblaApi.scrollNext(), intervalMs)
    const node = emblaApi.rootNode()
    const onEnter = () => clearInterval(timer)
    const onLeave = () => {
      clearInterval(timer)
      timer = setInterval(() => emblaApi.scrollNext(), intervalMs)
    }
    node.addEventListener('mouseenter', onEnter)
    node.addEventListener('mouseleave', onLeave)
    return () => {
      clearInterval(timer)
      node.removeEventListener('mouseenter', onEnter)
      node.removeEventListener('mouseleave', onLeave)
    }
  }, [emblaApi, intervalMs])

  const prev = () => emblaApi && emblaApi.scrollPrev()
  const next = () => emblaApi && emblaApi.scrollNext()

  return (
    <div className={`${poppins.className} mx-auto w-5xl h-auto rounded-3xl px-4`}>
      <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
        <div className="flex">
          {items.map((item, i) => (
            <div key={i} className="basis-full shrink-0">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
                <Image src={item.src} alt={`Slide ${i + 1}`} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/0" />
                <div className="absolute inset-y-0 left-0 p-6 flex items-center">
                  <div className="max-w-md translate-x-1/5">
                    <h3 className="text-white text-5xl font-semibold leading-tight">{item.title}</h3>
                    <p className="text-white/80 text-lg mt-2 leading-relaxed">{item.desc}</p>
                    <a href="/upload" className="mt-6 inline-block bg-white text-black px-6 py-2 rounded-full font-semibold transform transition-all duration-300 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20">
                      Upload your own music now!
                    </a>
                  </div>
                </div>
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                  <button onClick={prev} aria-label="Previous" className="rounded-full bg-white text-black p-2 shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={next} aria-label="Next" className="rounded-full bg-white text-black p-2 shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}