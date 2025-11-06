/* eslint-disable @next/next/no-html-link-for-pages */
import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";

interface HeaderProps {
  handleOpen: () => void;
  handleRemove: () => void;
  openClass: string;
}

const Header = ({ handleOpen, handleRemove, openClass }: HeaderProps) => {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });
  return (
    <>
      <header className={scroll ? "header sticky-bar stick" : "header sticky-bar"}>
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo">
                <Link href="/">
                  <span className="d-flex">
                    <img alt="jobBox" src="assets/imgs/template/jobhub-logo.svg" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="header-nav">
              <nav className="nav-main-menu">
                <ul className="main-menu">
                  <li className="has-children">
                    <Link href="/">
                      <span className="active">Home</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/">
                          <span>Home 1</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/index-2">
                          <span>Home 2</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/index-3">
                          <span>Home 3</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/index-4">
                          <span>Home 4</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/index-5">
                          <span>Home 5</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/index-6">
                          <span>Home 6</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/jobs-grid">
                      <span>Burs Bul</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/jobs-grid">
                          <span>Burslar Grid</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/jobs-list">
                          <span>Burslar List</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/job-details">
                          <span>Burs Detayları</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/job-details-2">
                          <span>Burs Detayları 2 </span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/companies-grid">
                      <span>Recruiters</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/companies-grid">
                          <span>Recruiters</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/company-details">
                          <span>Kurum Detayları</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/candidates-grid">
                      <span>Öğrenciler</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/candidates-grid">
                          <span>Öğrenciler Grid</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/candidate-details">
                          <span>Öğrenci Detayları</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/candidate-profile">
                          <span>Öğrenci Profili</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/blog-grid">
                      <span>Pages</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/page-about">
                          <span>About Us</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-pricing">
                          <span>Pricing Plan</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-contact">
                          <span>Contact Us</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-register">
                          <span>Register</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-signin">
                          <span>Signin</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-reset-password">
                          <span>Reset Password</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-content-protected">
                          <span>Content Protected</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/blog-grid">
                      <span>Blog</span>
                    </Link>

                    <ul className="sub-menu">
                      <li>
                        <Link href="/blog-grid">
                          <span>Blog Grid</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog-grid-2">
                          <span>Blog Grid 2</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog-details">
                          <span>Blog Single</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/page-contact">
                      <span>Contact</span>
                    </Link>
                  </li>
                </ul>
              </nav>
              <div
                className={`burger-icon burger-icon-white ${openClass && "burger-close"}`}
                onClick={() => {
                  handleOpen();
                  handleRemove();
                }}
              >
                <span className="burger-icon-top" />
                <span className="burger-icon-mid" />
                <span className="burger-icon-bottom" />
              </div>
            </div>
            <div className="header-right">
              <div className="block-signin">
                <Link href="page-register">
                  <span className="text-link-bd-btom hover-up">Register</span>
                </Link>

                <Link href="page-signin">
                  <span className="btn btn-default btn-shadow ml-40 hover-up">Sign in</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="mobile-header-active mobile-header-wrapper-style perfect-scrollbar">
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="perfect-scroll">
              <div className="mobile-search mobile-header-border mb-30">
                <form action="#">
                  <input type="text" placeholder="Search…" />
                  <i className="fi-rr-search" />
                </form>
              </div>
              <div className="mobile-menu-wrap mobile-header-border">
                {/* mobile menu start*/}
                <nav>
                  <ul className="mobile-menu font-heading">
                    <li className="has-children">
                      <Link href="/">
                        <span className="active">Home</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/">
                            <span>Home 1</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-2">
                            <span>Home 2</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-3">
                            <span>Home 3</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-4">
                            <span>Home 4</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-5">
                            <span>Home 5</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-6">
                            <span>Home 6</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/jobs-grid">
                        <span>Burs Bul</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/jobs-grid">
                            <span>Burslar Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/jobs-list">
                            <span>Burslar List</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/job-details">
                            <span>Burs Detayları</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/job-details-2">
                            <span>Burs Detayları 2 </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/companies-grid">
                        <span>Recruiters</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/companies-grid">
                            <span>Recruiters</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/company-details">
                            <span>Kurum Detayları</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/candidates-grid">
                        <span>Öğrenciler</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/candidates-grid">
                            <span>Öğrenciler Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/candidate-details">
                            <span>Öğrenci Detayları</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/blog-grid">
                        <span>Pages</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/page-about">
                            <span>About Us</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-pricing">
                            <span>Pricing Plan</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-contact">
                            <span>Contact Us</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-register">
                            <span>Register</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-signin">
                            <span>Signin</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-reset-password">
                            <span>Reset Password</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-content-protected">
                            <span>Content Protected</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/blog-grid">
                        <span>Blog</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/blog-grid">
                            <span>Blog Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog-grid-2">
                            <span>Blog Grid 2</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog-details">
                            <span>Blog Single</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link href="/page-contact">
                        <span>Contact</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="mobile-account">
                <h6 className="mb-10">Your Account</h6>
                <ul className="mobile-menu font-heading">
                  <li>
                    <Link href="#">
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Work Preferences</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Account Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Go Pro</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/page-signin">
                      <span>Sign Out</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="site-copyright">
                Copyright 2022 © JobBox. <br />
                Designed by AliThemes.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile-header-active mobile-header-wrapper-style perfect-scrollbar">
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="perfect-scroll">
              <div className="mobile-search mobile-header-border mb-30">
                <form action="#">
                  <input type="text" placeholder="Search…" />
                  <i className="fi-rr-search" />
                </form>
              </div>
              <div className="mobile-menu-wrap mobile-header-border">
                {/* mobile menu start*/}
                <nav>
                  <ul className="mobile-menu font-heading">
                    <li className="has-children">
                      <Link href="/">
                        <span className="active">Home</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/">
                            <span>Home 1</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-2">
                            <span>Home 2</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-3">
                            <span>Home 3</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-4">
                            <span>Home 4</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-5">
                            <span>Home 5</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/index-6">
                            <span>Home 6</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/jobs-grid">
                        <span>Burs Bul</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/jobs-grid">
                            <span>Burslar Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/jobs-list">
                            <span>Burslar List</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/job-details">
                            <span>Burs Detayları</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/job-details-2">
                            <span>Burs Detayları 2 </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/companies-grid">
                        <span>Recruiters</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/companies-grid">
                            <span>Recruiters</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/company-details">
                            <span>Kurum Detayları</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/candidates-grid">
                        <span>Öğrenciler</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/candidates-grid">
                            <span>Öğrenciler Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/candidate-details">
                            <span>Öğrenci Detayları</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/blog-grid">
                        <span>Pages</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/page-about">
                            <span>About Us</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-pricing">
                            <span>Pricing Plan</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-contact">
                            <span>Contact Us</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-register">
                            <span>Register</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-signin">
                            <span>Signin</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-reset-password">
                            <span>Reset Password</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/page-content-protected">
                            <span>Content Protected</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link href="/blog-grid">
                        <span>Blog</span>
                      </Link>

                      <ul className="sub-menu">
                        <li>
                          <Link href="/blog-grid">
                            <span>Blog Grid</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog-grid-2">
                            <span>Blog Grid 2</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="/blog-details">
                            <span>Blog Single</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link href="/page-contact">
                        <span>Contact</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="mobile-account">
                <h6 className="mb-10">Your Account</h6>
                <ul className="mobile-menu font-heading">
                  <li>
                    <Link href="#">
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Work Preferences</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Account Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span>Go Pro</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/page-signin">
                      <span>Sign Out</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="site-copyright">
                Copyright 2022 © JobBox. <br />
                Designed by AliThemes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
