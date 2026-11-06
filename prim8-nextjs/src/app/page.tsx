import { homeContent } from "@/content/home";
import { HomeView } from "@/views/HomeView";

export default function HomePage() {
  return <HomeView content={homeContent} />;
}
