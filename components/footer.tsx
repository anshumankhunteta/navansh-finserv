import Link from "next/link";

const Footer = () => {
  const footerLinks = {
    services: [
      { href: "/services", label: "Life & Health Insurance" },
      { href: "/services", label: "Asset Protection" },
    ],
    company: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
    ],
  };

  return (
    <footer className="border-t border-slate-700 bg-slate-900">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-amber-500">
              Navansh Finserv
            </h3>
            <p className="text-sm text-slate-400">
              Protecting futures with 15 years of experience.
            </p>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-50">
              Services
            </h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-amber-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-50">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-amber-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 border-t border-slate-700 pt-8">
          <div className="space-y-2 text-xs text-slate-500">
            <p className="font-semibold text-slate-400">Disclaimer:</p>
            <p>
              [INSERT DISCLAIMER TEXT HERE] This website provides general
              information about insurance products and services. Individual
              circumstances may vary, and coverage is subject to policy terms
              and conditions. Please consult with a licensed insurance
              professional for personalized advice.
            </p>
            <p className="mt-4">
              © {new Date().getFullYear()} Navansh Finserv. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
