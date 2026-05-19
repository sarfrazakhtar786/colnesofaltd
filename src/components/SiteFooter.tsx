import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-4 lg:px-10">
        <div className="lg:col-span-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl">Colne</span>
            <span className="font-display text-2xl italic text-primary">Sofa LTD</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Hand-crafted sofas made to order in our atelier. Sustainable materials, lifetime frames,
            and a quiet sense of luxury.
          </p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/collection" className="hover:text-primary">
                Collection
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>{" "}
            <li>
              <Link to="/quote" className="hover:text-primary">
                Custom Order
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Visit</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>14 Rue de l&apos;Artisan</li>
            <li>75011 Paris, France</li>
            <li>hello@colnesofa.com</li>
            <li>+33 1 42 00 00 00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} Colne Sofa LTD. All rights reserved.</p>
          <p>Crafted in France · Shipped worldwide</p>
        </div>
      </div>
    </footer>
  );
}
