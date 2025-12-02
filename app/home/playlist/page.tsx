'use client'
import Protector from '@/app/Components/Protector'
import PlaylistView from '../../Components/playlistView'
export default function HomePlaylists() {
  return (
    <div>
      <Protector>
        <PlaylistView />
      </Protector>
    </div>
  )
}