"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

export default function Navbar() {
  const pathname = usePathname();

  // Route change হলে mobile menu নতুন করে closed অবস্থায় থাকবে।
  return <Navigation key={pathname} pathname={pathname} />;
}

function Navigation({ pathname }) {
  const [isOpen, setIsOpen] = useState(false);

  function isActive(href) {
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function renderLinks(mobile = false) {
    return navigation.map(({ label, href }) => (
      <Link
        key={label}
        href={href}
        onClick={() => setIsOpen(false)}
        aria-current={isActive(href) ? "page" : undefined}
        className={`nav-link ${mobile ? "block" : ""} ${
          isActive(href) ? "nav-link-active" : ""
        }`}
      >
        {label}
      </Link>
    ));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 backdrop-blur-xl">
      <div className="site-container flex h-20 items-center justify-between gap-3">
        <Logo />

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {renderLinks()}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/login" className="btn btn-ghost">
              Log in
            </Link>

            <Link href="/register" className="btn btn-primary">
              Get started
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-square lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-base-300 bg-base-100 lg:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
        >
          <div className="site-container space-y-1 py-4">
            {renderLinks(true)}

            <div className="grid grid-cols-2 gap-3 border-t border-base-300 pt-4 mt-3">
              <Link
                href="/login"
                className="btn btn-outline"
                onClick={() => setIsOpen(false)}
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="btn btn-primary"
                onClick={() => setIsOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}