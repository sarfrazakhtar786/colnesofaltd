import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { contactDetails, fetchContactDetails, getPhoneHref } from "@/lib/contact";

export function SiteFooter() {
  const [details, setDetails] = useState(contactDetails);

  useEffect(() => {
    fetchContactDetails().then((nextDetails) => {
      setDetails({ ...nextDetails, phoneHref: getPhoneHref(nextDetails.phoneDisplay) });
    });
  }, []);

  return (
    <footer className="mt-32 bg-[#111111] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-4 lg:px-10">
        <div className="lg:col-span-2">
          <img
            src="/colne-sofa-logo-navbar-light.png"
            alt="Colne Sofa LTD"
            className="h-16 w-auto max-w-[300px] object-contain"
          />
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
            {details.addressLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
            <li>
              <a href={`mailto:${details.email}`} className="transition-colors hover:text-primary">
                {details.email}
              </a>
            </li>
            <li>
              <a href={details.phoneHref} className="transition-colors hover:text-primary">
                {details.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-white/55 md:flex-row lg:px-10">
          <p>&copy; {new Date().getFullYear()} Colne Sofa LTD. All rights reserved.</p>
          <p>Based in the UK &middot; Shipped worldwide</p>
        </div>
      </div>
    </footer>
  );
}
