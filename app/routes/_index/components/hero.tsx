import { Button, buttonVariants } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/react-router";
import { Link } from "react-router";

export default function Hero() {
  return (
    <div className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold italic tracking-tight mb-2">
          Beta Base
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10">
          track your sends
        </p>
        <SignedOut>
          <Link
            to="/sign-up"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            <span className="relative z-10">Try it free</span>
            <div className="absolute inset-0 bg-white/20 blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
          </Link>
        </SignedOut>
        <SignedIn>
          <Link
            to="/dashboard"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            <span className="relative z-10">Let's go</span>
          </Link>
        </SignedIn>
      </div>
    </div>
  );
}
