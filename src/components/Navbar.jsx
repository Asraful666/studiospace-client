"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import AuthActions from "@/components/AuthActions";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

export default function Navbar() {
  const pathname = usePathname();

  return <Navigation key={pathname} pathname={pathname} />;
}

function Navigation({ pathname }) {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

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
        onClick={closeMenu}
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

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {renderLinks()}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden lg:block">
            <AuthActions />
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-square lg:hidden"
            onClick={() => setIsOpen((previous) => !previous)}
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
            if (event.key === "Escape") closeMenu();
          }}
        >
          <div className="site-container space-y-1 py-4">
            {renderLinks(true)}

            <div className="mt-3 flex justify-end border-t border-base-300 pt-4">
              <AuthActions onNavigate={closeMenu} />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}