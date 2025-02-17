import type { Route } from "./+types/route";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
// import Features from "@/components/features";
// import CTA from "@/components/cta";
// import Footer from "@/components/footer";
import MouseMoveEffect from "./components/mouse-move-effect";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beta Base" },
    { name: "description", content: "Track your sends" },
  ];
}

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen">
        {/* Background gradients */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-linear-to-b from-background via-background/90 to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-primary/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-primary/10 blur-[100px]" />
        </div>

        <div className="min-h-screen flex flex-col">
          <div>
            <Navbar />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Hero />
          </div>
          {/* <Features /> */}
          {/* <CTA /> */}
          {/* <Footer /> */}
        </div>
      </div>
      <MouseMoveEffect />
    </>
  );
}
