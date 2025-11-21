import Homepage from "../Components/homepage";
import Sidebar  from "../Components/sidebar";
import Player from "../Components/player";
export default function Home() {
  return (
    <main className="w-full min-h-screen pl-[280px] pb-28">
      <div className="fixed top-0 left-0 h-full w-[280px]">
        <Sidebar />
      </div>
      <Homepage />
      <Player offsetLeft={280} />
    </main>
  );
}