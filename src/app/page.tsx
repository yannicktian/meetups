import { SlidesDeck } from "@/components/deck/slides-deck";
import { slides } from "@/content/slides";

export default function Home() {
  return <SlidesDeck slides={slides} />;
}
