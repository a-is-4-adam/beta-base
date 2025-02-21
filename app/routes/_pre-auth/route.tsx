import { ClerkLoaded } from "@clerk/react-router";
import { Outlet, redirect } from "react-router";
import MouseMoveEffect from "../_index/components/mouse-move-effect";
import type { Route } from "./+types/route";
import { getUserId } from "@/server/clerk";

export async function loader(args: Route.LoaderArgs) {
  const userId = await getUserId(args);

  if (userId) {
    return redirect(process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL!);
  }

  return null;
}

export default function Route() {
  return (
    <ClerkLoaded>
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-linear-to-b from-background via-background/90 to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-primary/15 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-primary/15 blur-[100px]" />
        </div>
        <div className="px-4 py-12 w-full z-20">
          <div className="w-full max-w-md flex flex-col items-center mx-auto">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold italic tracking-tight mb-2">
              Beta Base
            </h2>
            <div className="mt-10 w-full">
              <Outlet />
            </div>
          </div>
        </div>
        <MouseMoveEffect />
      </div>
    </ClerkLoaded>
  );
}
