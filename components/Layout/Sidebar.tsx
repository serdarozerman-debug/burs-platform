"use client";
import Link from "next/link";
import { useState } from "react";

interface SidebarProps {
  openClass: string;
}

const Sidebar = ({ openClass }: SidebarProps) => {
  const [isActive, setIsActive] = useState({
    status: false,
    key: 0,
  });

  const handleToggle = (key: number) => {
    if (isActive.key === key) {
      setIsActive({
        status: false,
        key: 0,
      });
    } else {
      setIsActive({
        status: true,
        key,
      });
    }
  };

  return (
    <>
      <div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${openClass}`}>
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="perfect-scroll">
              <div className="mobile-search mobile-header-border mb-30">
                <form action="#">
                  <input id="mobile-search-input" name="search" type="text" placeholder="Search…" />
                  <i className="fi-rr-search" />
                </form>
              </div>
              <div className="mobile-menu-wrap mobile-header-border">
                {/* mobile menu start*/}
                <nav>
                  <ul className="mobile-menu font-heading">
                    <li>
                      <Link href="/">
                        <span>Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/hakkimizda">
                        <span>Hakkımızda</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog-grid">
                        <span>Blog</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/#contact-section">
                        <span>İletişim</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/page-register">
                        <span>Kayıt Ol</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/page-signin">
                        <span>Giriş Yap</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="site-copyright">
                Copyright 2024 © BursBuldum. <br />
                Designed by AliThemes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
