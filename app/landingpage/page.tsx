import { Search } from "lucide";
import Carousel from "../Components/carousel";
import FeatureArtist from "../Components/featureArtist";
import FeatureMusic from "../Components/featureMusic";
import Membership from "../Components/membership";
import TopBar from "../Components/topbar";
import SearchBar from "../Components/search";
import Footer from "../Components/footer";
export default function Home() {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center gap-12">
        <TopBar />
        <Carousel />
        <SearchBar />
        <FeatureArtist />
        <Membership />
        <FeatureMusic />
        <Footer />
    </main>
  )
}