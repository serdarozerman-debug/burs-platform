/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer id="contact-section" className="footer mt-50">
      <div className="container">
        <div className="row">
          <div className="footer-col-1 col-md-3 col-sm-12">
            <Link href="/">
              <span>
                <img alt="BursBuldum" src="/assets/imgs/template/tum-burslar-logo.svg" />
              </span>
            </Link>
            <div className="mt-20 mb-20 font-xs color-text-paragraph-2">BursBuldum, yurtiçi ve yurtdışındaki üniversite burslarına ve diğer tüm burslara kolayca ulaşmanızı sağlayan platformdur.</div>
            <div className="footer-social">
              <a className="icon-socials icon-facebook" href="#" />
              <a className="icon-socials icon-twitter" href="#" />
              <a className="icon-socials icon-linkedin" href="#" />
            </div>
          </div>
          <div className="footer-col-2 col-md-2 col-xs-6">
            <h6 className="mb-20">Ana Sayfa</h6>
            <ul className="menu-footer">
              <li>
                <Link href="/">Ana Sayfa</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col-3 col-md-2 col-xs-6">
            <h6 className="mb-20">Hakkımızda</h6>
            <ul className="menu-footer">
              <li>
                <Link href="/hakkimizda">Hakkımızda</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col-4 col-md-2 col-xs-6">
            <h6 className="mb-20">Blog</h6>
            <ul className="menu-footer">
              <li>
                <Link href="/blog-grid">Blog</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col-5 col-md-2 col-xs-6">
            <h6 className="mb-20">İletişim</h6>
            <ul className="menu-footer">
              <li>
                <Link href="/#contact-section">İletişim</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom mt-50">
          <div className="row">
            <div className="col-md-6">
              <span className="font-xs color-text-paragraph">Telif Hakkı © 2024. BursBuldum. Tüm hakları saklıdır.</span>
            </div>
            <div className="col-md-6 text-md-end text-start">
              <div className="footer-social">
                <a className="font-xs color-text-paragraph" href="#">
                  Gizlilik Politikası
                </a>
                <a className="font-xs color-text-paragraph mr-30 ml-30" href="#">
                  Kullanım Şartları
                </a>
                <a className="font-xs color-text-paragraph" href="#">
                  Güvenlik
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
