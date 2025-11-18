import Link from 'next/link'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })

export default function Footer() {
  return (
    <footer className={`${poppins.className} w-full bg-black/10 text-white/80 text-sm py-8`}>
      <div className="mx-auto max-w-6xl px-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-white text-lg font-semibold">Wonder Music</div>
          <div className="text-white/80">Wonder Music Inc., 123 Music Ave, Wonderland, USA</div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Link href="#" className="hover:text-white">Directory</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">About us</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Artist Resources</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Newsroom</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Jobs</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Developers</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Help</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Legal</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Privacy</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Cookie Policy</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Cookie Manager</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Imprint</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Charts</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Transparency Reports</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white">Transparency Reports</Link>
        </div>
        <div className="flex items-center justify-between">
          <div>© 2025 Wonder Music. All rights reserved.</div>
          <div className="text-white">Language: English (US)</div>
        </div>
      </div>
    </footer>
  )
}