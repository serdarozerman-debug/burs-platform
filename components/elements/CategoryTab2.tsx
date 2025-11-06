"use client";
import React, { useState } from "react";
import Link from "next/link";

const CategoryTab2 = () => {
  const [active, setActive] = useState(1);

  const handleOnClick = (index: number) => {
    setActive(index); // remove the curly braces
  };
  return (
    <>
      <div className="list-tabs mt-40  text-start">
        <ul className="nav nav-tabs" role="tablist">
          <li>
            <span className={active === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>
              <img src="/assets/imgs/page/homepage1/management.svg" alt="jobBox" /> Management
            </span>
          </li>
          <li>
            <span className={active === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>
              <img src="/assets/imgs/page/homepage1/marketing.svg" alt="jobBox" /> Marketing &amp; Sale
            </span>
          </li>
          <li>
            <span className={active === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>
              <img src="/assets/imgs/page/homepage1/finance.svg" alt="jobBox" /> Finance
            </span>
          </li>
          <li>
            <span className={active === 4 ? "active" : ""} onClick={() => handleOnClick(4)}>
              <img src="/assets/imgs/page/homepage1/human.svg" alt="jobBox" /> Human Resource
            </span>
          </li>
          <li>
            <span className={active === 5 ? "active" : ""} onClick={() => handleOnClick(5)}>
              <img src="/assets/imgs/page/homepage1/retail.svg" alt="jobBox" /> Retail &amp; Products
            </span>
          </li>
          <li>
            <span className={active === 6 ? "active" : ""} onClick={() => handleOnClick(6)}>
              <img src="/assets/imgs/page/homepage1/content.svg" alt="jobBox" /> Content Writer
            </span>
          </li>
        </ul>
      </div>
      <div className="tab-content mt-50" id="myTabContent-1">
        <div className={`tab-pane fade ${active == 1 && "show active"}`}>
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot bg-green">
                    <span>Freelancer</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img1.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">New York, US</span>
                    <span className="card-time">3 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Figma</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Adobe XD</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$90 - $120</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img2.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Digital Marketing Manager</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">6 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">SEO</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Word</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img3.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Web Designer/Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">9 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">HTML</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">CSS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">JS</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$120 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img4.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">13 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NodeJS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">MongoDB</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img5.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Frontend Developer Full time</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">16 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Bootstrap</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img6.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Mobile Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">30 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">React</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NextJS </span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 2 && "show active"}`}>
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img2.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Digital Marketing Manager</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">6 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">SEO</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Word</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img3.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Web Designer/Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">9 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">HTML</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">CSS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">JS</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$120 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img4.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">13 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NodeJS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">MongoDB</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img5.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Frontend Developer Full time</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">16 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Bootstrap</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img6.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Mobile Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">30 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">React</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NextJS </span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot bg-green">
                    <span>Freelancer</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img1.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">New York, US</span>
                    <span className="card-time">3 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Figma</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Adobe XD</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$90 - $120</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 3 && "show active"}`}>
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img3.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Web Designer/Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">9 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">HTML</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">CSS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">JS</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$120 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img4.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">13 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NodeJS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">MongoDB</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img5.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Frontend Developer Full time</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">16 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Bootstrap</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img6.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Mobile Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">30 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">React</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NextJS </span>
                        </Link>

                        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12" />
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot bg-green">
                    <span>Freelancer</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img1.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">New York, US</span>
                    <span className="card-time">3 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Figma</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Adobe XD</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$90 - $120</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img2.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Digital Marketing Manager</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">6 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">SEO</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Word </span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 4 && "show active"}`}>
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img3.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Web Designer/Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">9 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">HTML</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">CSS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">JS</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$120 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img4.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">13 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NodeJS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">MongoDB</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot bg-green">
                    <span>Freelancer</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img1.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">New York, US</span>
                    <span className="card-time">3 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Figma</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Adobe XD</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$90 - $120</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img2.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Digital Marketing Manager</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">6 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">SEO</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Word</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img5.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Frontend Developer Full time</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">16 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Bootstrap</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img6.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Mobile Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">30 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">React</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NextJS </span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 5 && "show active"}`}>
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img3.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Web Designer/Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">9 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">HTML</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">CSS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">JS</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$120 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot bg-green">
                    <span>Freelancer</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img1.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">New York, US</span>
                    <span className="card-time">3 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Figma</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Adobe XD</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$90 - $120</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img2.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Digital Marketing Manager</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">6 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">SEO</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Word</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img4.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">13 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NodeJS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">MongoDB</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img5.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Frontend Developer Full time</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">16 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Bootstrap</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img6.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Mobile Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">30 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">React</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NextJS </span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 6 && "show active"}`}>
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img4.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">13 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NodeJS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">MongoDB</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot bg-green">
                    <span>Freelancer</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img1.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">New York, US</span>
                    <span className="card-time">3 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Figma</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Adobe XD</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$90 - $120</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img2.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Digital Marketing Manager</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">6 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">SEO</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Word</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img3.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Web Designer/Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">9 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">HTML</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">CSS</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">JS</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$120 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img5.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>Frontend Developer Full time</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">16 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">Bootstrap</span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 grid-bd-16 hover-up">
                <div className="card-grid-2-image">
                  <span className="lbl-hot">
                    <span>Full time</span>
                  </span>
                  <div className="image-box">
                    <figure>
                      <img src="assets/imgs/page/homepage2/img6.png" alt="jobBox" />
                    </figure>
                  </div>
                </div>
                <div className="card-block-info">
                  <h5>
                    <Link href="/job-details">
                      <span>React Native Mobile Developer</span>
                    </Link>
                  </h5>
                  <div className="mt-5">
                    <span className="card-location mr-15">Chicago, US</span>
                    <span className="card-time">30 mins ago</span>
                  </div>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-xl-7 col-md-7 mb-2">
                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">React</span>
                        </Link>

                        <Link href="/jobs-grid">
                          <span className="btn btn-tags-sm mr-5">NextJS </span>
                        </Link>
                      </div>
                      <div className="col-xl-5 col-md-5 text-lg-end">
                        <span className="card-text-price">$80 - $150</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-sm color-text-paragraph mt-20">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryTab2;
