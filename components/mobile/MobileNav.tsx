"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Student navigation items
  const studentNavItems = [
    { href: "/dashboard", icon: "🏠", label: "Ana Sayfa" },
    { href: "/", icon: "🎓", label: "Burslar" },
    { href: "/wallet", icon: "📁", label: "Cüzdan" },
    { href: "/chat", icon: "💬", label: "Asistan" },
  ];

  // Organization navigation items
  const orgNavItems = [
    { href: "/dashboard", icon: "🏢", label: "Panel" },
    { href: "/scholarships", icon: "📝", label: "Burslar" },
    { href: "/applications", icon: "📋", label: "Başvurular" },
  ];

  const isStudent = pathname.includes("(student)") || pathname === "/dashboard";
  const navItems = isStudent ? studentNavItems : orgNavItems;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Hamburger Menu (Tablet/Mobile) */}
      <div className="d-lg-none">
        <button
          className="btn btn-link position-fixed top-0 start-0 m-3"
          style={{ zIndex: 1100 }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span style={{ fontSize: 24 }}>{menuOpen ? "✕" : "☰"}</span>
        </button>

        {/* Overlay */}
        {menuOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1050 }}
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Sidebar Menu */}
        <div
          className={`position-fixed top-0 start-0 h-100 bg-white shadow-lg ${
            menuOpen ? "" : "translate-middle-x"
          }`}
          style={{
            width: 280,
            zIndex: 1060,
            transition: "transform 0.3s ease-in-out",
            transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Menü</h5>
              <button
                className="btn btn-sm btn-link"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            <nav className="nav flex-column gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link d-flex align-items-center p-3 rounded ${
                    isActive(item.href)
                      ? "bg-primary text-white"
                      : "text-dark hover-bg-light"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="me-3" style={{ fontSize: 24 }}>
                    {item.icon}
                  </span>
                  <span className="fw-semibold">{item.label}</span>
                </Link>
              ))}

              <hr />

              <Link
                href="/profile"
                className="nav-link d-flex align-items-center p-3 rounded text-dark hover-bg-light"
                onClick={() => setMenuOpen(false)}
              >
                <span className="me-3" style={{ fontSize: 24 }}>
                  👤
                </span>
                <span>Profil</span>
              </Link>

              <Link
                href="/settings"
                className="nav-link d-flex align-items-center p-3 rounded text-dark hover-bg-light"
                onClick={() => setMenuOpen(false)}
              >
                <span className="me-3" style={{ fontSize: 24 }}>
                  ⚙️
                </span>
                <span>Ayarlar</span>
              </Link>

              <button
                className="nav-link d-flex align-items-center p-3 rounded text-danger hover-bg-light w-100 text-start border-0 bg-transparent"
                onClick={() => {
                  setMenuOpen(false);
                  // Logout logic
                }}
              >
                <span className="me-3" style={{ fontSize: 24 }}>
                  🚪
                </span>
                <span>Çıkış Yap</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav
        className="d-lg-none position-fixed bottom-0 start-0 w-100 bg-white border-top shadow-lg"
        style={{ zIndex: 1000, paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="d-flex justify-content-around align-items-center py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`d-flex flex-column align-items-center text-decoration-none ${
                isActive(item.href) ? "text-primary" : "text-muted"
              }`}
              style={{ minWidth: 60, fontSize: 12 }}
            >
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <span className="mt-1">{item.label}</span>
            </Link>
          ))}
          <button
            className="d-flex flex-column align-items-center text-decoration-none text-muted border-0 bg-transparent"
            style={{ minWidth: 60, fontSize: 12 }}
            onClick={() => setMenuOpen(true)}
          >
            <span style={{ fontSize: 24 }}>☰</span>
            <span className="mt-1">Menü</span>
          </button>
        </div>
      </nav>
    </>
  );
}

