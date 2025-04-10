import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useHref,
  useMatches,
  useNavigate,
  type NavigateOptions,
} from "react-router";
import { dark } from "@clerk/themes";

import { rootAuthLoader } from "@clerk/react-router/ssr.server";

import type { Route } from "./+types/root";
import "./app.css";
import { ClerkProvider } from "@clerk/react-router";
import { RouterProvider } from "react-aria-components";
import { cn } from "./lib/utils";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap",
  },
];

export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args);
}

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();

  const isScrollLocked = matches.some((match) => match.handle?.isScrollLocked);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <Meta />
        <Links />
      </head>
      <body
        className={cn(`bg-background text-foreground antialiased`, {
          "overflow-hidden": isScrollLocked,
        })}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  let navigate = useNavigate();

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <ClerkProvider
        loaderData={loaderData}
        signUpFallbackRedirectUrl="/"
        signInFallbackRedirectUrl="/"
        appearance={{
          baseTheme: dark,
        }}
      >
        <Outlet />
      </ClerkProvider>
    </RouterProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}
