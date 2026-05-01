import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-foreground">404</h1>
        <h2 className="mt-4 text-xl text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Colne Sofa LTD — Hand-crafted Sofas, Made to Order" },
      { name: "description", content: "A UK Based atelier of bespoke sofas. Discover the collection or request a custom quote." },
      { name: "author", content: "Colne Sofa LTD" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Colne Sofa LTD — Hand-crafted Sofas, Made to Order" },
      { name: "twitter:title", content: "Colne Sofa LTD — Hand-crafted Sofas, Made to Order" },
      { property: "og:description", content: "A UK Based atelier of bespoke sofas. Discover the collection or request a custom quote." },
      { name: "twitter:description", content: "A UK Based atelier of bespoke sofas. Discover the collection or request a custom quote." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/da31351f-79d7-406a-a000-ea61d20a2360/id-preview-f778d8eb--0776b38f-66d7-46e2-9dbe-8c18146f4046.lovable.app-1777404692590.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/da31351f-79d7-406a-a000-ea61d20a2360/id-preview-f778d8eb--0776b38f-66d7-46e2-9dbe-8c18146f4046.lovable.app-1777404692590.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
