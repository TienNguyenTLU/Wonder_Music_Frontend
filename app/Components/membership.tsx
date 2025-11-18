// c:\Users\tienc\Documents\Web Java\wonder_music_fe\app\Components\membership.tsx
'use client'

import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })

export default function Membership() {
  return (
    <section className={poppins.className}>
        <h2 className="text-white text-3xl font-bold text-center mb-8">Membership</h2>
        <p className="text-white/80 text-center text-sm mb-8">Choose the right plan for you</p>
      <div className="w-full px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="transform transition-all duration-300 hover:scale-105 w-40% h-auto rounded-3xl bg-white/5 backdrop-blur p-6 border border-white/10 flex flex-col items-center gap-5">
            <div className="text-white text-xl font-semibold">Free Plan</div>
          <div className="text-white text-3xl mt-2">Free</div>
          <ul className="text-white/80 text-sm mt-4 space-y-2">
            <li>Ad-supported</li>
            <li>Standard quality</li>
            <li>No Community access</li>
          </ul>
          <a href="/" className="mt-6 rounded-3xl bg-white text-black px-5 py-2">Choose Free</a>
        </div>
        <div className="transform transition-all duration-300 hover:scale-105 w-40% h-auto rounded-3xl bg-white/5 backdrop-blur p-6 border border-white/10 flex flex-col items-center gap-5">
          <div className="text-white text-xl font-semibold">Basic Plan</div>
          <div className="text-white text-3xl mt-2">$3/month</div>
          <ul className="text-white/80 text-sm mt-4 space-y-2">
            <li>Ad-supported</li>
            <li>Standard quality</li>
            <li>Community access</li>
          </ul>
          <a href="/" className="mt-6 rounded-3xl bg-white text-black px-5 py-2">Choose Basic</a>
        </div>
        <div className="transform transition-all duration-300 hover:scale-105 w-40% h-auto rounded-3xl bg-white/5 backdrop-blur p-6 border border-white/10 flex flex-col items-center gap-5">
          <div className="text-white text-xl font-semibold">Pro Plan</div>
          <div className="text-white text-3xl mt-2">$5/month</div>
          <ul className="text-white/80 text-sm mt-4 space-y-2">
            <li>No ads</li>
            <li>High quality</li>
            <li>Priority support</li>
          </ul>
          <a href="/" className="mt-6 rounded-3xl bg-white text-black px-5 py-2">Choose Pro</a>
        </div>
      </div>
    </section>
  )
}