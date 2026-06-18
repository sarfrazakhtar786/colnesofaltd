import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { contactDetails, fetchContactDetails, getPhoneHref } from "@/lib/contact";

const socialIcons = [
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "youtube", label: "YouTube", icon: Youtube },
] as const;

export function SiteFooter() {
  const [details, setDetails] = useState(contactDetails);
  const phoneNumbers = [details.phoneDisplay, ...details.additionalPhones].filter(Boolean);

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
            {details.footerText}
          </p>
          {socialIcons.some((social) => details.socialLinks[social.key]) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {socialIcons.map((social) => {
                const href = details.socialLinks[social.key];
                const Icon = social.icon;
                if (!href) return null;

                return (
                  <a
                    key={social.key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/15 text-white/72 transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
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
            {phoneNumbers.map((phone) => (
              <li key={phone}>
                <a href={getPhoneHref(phone)} className="transition-colors hover:text-primary">
                  {phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-white/55 md:flex-row lg:px-10">
          <p>&copy; {new Date().getFullYear()} Colne Sofa LTD. All rights reserved.</p>
          <p>Based in the UK</p>
        </div>
      </div>
    </footer>
  );
}
