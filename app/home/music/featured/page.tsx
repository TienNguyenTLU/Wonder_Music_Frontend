"use client"

import SongList from "../../../Components/SongList"
import Sidebar from "../../../Components/sidebar"
import Protector from "../../../Components/Protector"

export default function FeaturedMusicPage() {
  return (
    <Protector>
      <main className="w-full min-h-screen bg-[#121212] text-white pl-[280px]">
        <div className="fixed top-0 left-0 h-full w-[280px]">
          <Sidebar />
        </div>
        <SongList title="Featured Tracks" endpoint="/api/songs" defaultSort="newest" />
      </main>
    </Protector>
  )
}
