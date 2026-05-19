import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 bg-[#111111] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-4 lg:px-10">
        <div className="lg:col-span-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl text-primary">Colne</span>
            <span className="font-display text-2xl italic text-primary">Sofa LTD</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Hand-crafted sofas made to order in our atelier. Sustainable materials, lifetime frames,
            and a quiet sense of luxury.
          </p>
        </div>
        <div>
          <p className="eyebrow text-primary">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-white/72">
            <li>
              <Link to="/collection" className="transition-colors hover:text-primary">
                Collection
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/quote" className="transition-colors hover:text-primary">
                Custom Order
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-primary">Visit</p>
          <ul className="mt-4 space-y-2 text-sm text-white/72">
            <li>14 Rue de l&apos;Artisan</li>
            <li>75011 Paris, France</li>
            <li>hello@colnesofa.com</li>
            <li>+33 1 42 00 00 00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-white/55 md:flex-row lg:px-10">
          <p>&copy; {new Date().getFullYear()} Colne Sofa LTD. All rights reserved.</p>
          <p>Crafted in France &middot; Shipped worldwide</p>
        </div>
      </div>
    </footer>
  );
}
