import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { Link } from "react-router";

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
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button variant="ghost" size="sm">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}
