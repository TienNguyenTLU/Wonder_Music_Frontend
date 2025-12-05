import ArtistsPage from "../../Components/ArtistsPage";
import Sidebar  from "../../Components/sidebar";
import Player from "../../Components/player";
import Protector from "../../Components/Protector";

export default function Artists() {
  return (
    <Protector>
      <main className="w-full min-h-screen bg-[#121212] pl-[280px] pb-28">
        <div className="fixed top-0 left-0 h-full w-[280px]">
          <Sidebar />
        </div>
        <ArtistsPage />
        <Player offsetLeft={280} />
      </main>
    </Protector>
  );
}
