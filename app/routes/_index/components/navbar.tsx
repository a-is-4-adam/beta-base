import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { SignedIn, SignedOut } from "@clerk/react-router";
import { Github } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-(--breakpoint-2xl) items-center">
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          {/* <Link
            to="/solutions"
            className="transition-colors hover:text-primary"
          >
            Solutions
          </Link> */}
        </nav>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <Link
              to="/sign-in"
              className={buttonVariants({ variant: "ghost" })}
            >
              Sign in
            </Link>
            <Link
              to="/sign-up"
              className={buttonVariants({ variant: "ghost" })}
            >
              Sign up
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className={buttonVariants({ variant: "ghost" })}
            >
              Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
