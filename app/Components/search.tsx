'use client'
import { useState } from 'react'
import { Poppins } from 'next/font/google'
import { Search } from 'lucide-react'
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })
type SearchBarProps = {
  placeholder?: string
  onSearch?: (term: string) => void
  defaultValue?: string
}

export default function SearchBar({ placeholder = 'Search music, artists, playlists...', onSearch, defaultValue = '' }: SearchBarProps) {
  const [term, setTerm] = useState(defaultValue)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSearch?.(term.trim())
  }

  return (
    <div className={`${poppins.className} mx-auto max-w-6xl px-6`}>
        <h3 className="text-3xl mx-auto font-bold text-white/90 mb-6">Explore music, artists, playlists...</h3>
        <div className="flex justify-center gap-4">
        <form role="search" onSubmit={submit} className="relative w-full md:w-[640px]">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/70">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-3xl bg-white text-black pl-12 pr-28 py-3 shadow transition focus:outline-none focus:ring-2 focus:ring-black/20"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-3xl text-black px-4 py-2 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black/20"
        >
            <Search className="text-black w-5 h-5" />
        </button>
      </form>
      <p className="text-white/90 text-md mt-4">
        or
      </p>
      <a href="/" className="text-center rounded-full bg-white text-black px-3 py-3 transform transition-all duration-300 hover:scale-110">Upload your own! </a>
        </div>
    </div>
  )
}