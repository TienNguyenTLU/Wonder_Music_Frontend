"use client"

import { Poppins } from "next/font/google"
import HomeCategories from "./sections/HomeCategories"
import HomePlaylists from "./sections/HomePlaylists"
import HomeSongs from "./sections/HomeSongs"
import HomeArtists from "./sections/HomeArtists"
import HomeFeaturedPlaylists from "./sections/HomeFeaturedPlaylists"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

export default function Homepage() {
  return (
    <main className={`${poppins.className} w-full`}>
      <div className="w-full px-10 py-10 space-y-12">
        <HomeCategories />
        <HomePlaylists />
        <HomeSongs />
        <HomeArtists />
        <HomeFeaturedPlaylists />
      </div>
    </main>
  )
}
