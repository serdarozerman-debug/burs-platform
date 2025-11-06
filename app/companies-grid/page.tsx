/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import BlogSlider from "@/components/sliders/Blog";

export default function CompaniesGrid() {
  return (
    <>
      <Layout>
        <div>
          <section className="section-box-2">
            <div className="container">
              <div className="banner-hero banner-company">
                <div className="block-banner text-center">
                  <h3 className="wow animate__animated animate__fadeInUp">Browse Companies</h3>
                  <div className="font-sm color-text-paragraph-2 mt-10 wow animate__animated animate__fadeInUp" data-wow-delay=".1s">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, <br className="d-none d-xl-block" />
                    atque delectus molestias quis?
                  </div>
                  <div className="box-list-character">
                    <ul>
                      <li>
                        <Link href="#">
                          <span className="active">A</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>B</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>C</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>D</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>E</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>F</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>G</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>H</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>I</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>J</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>K</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>L</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>M</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>N</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>O</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>P</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>Q</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>R</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>S</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>T</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>U</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>V</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>W</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>X</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>Y</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>Z</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-30">
            <div className="container">
              <div className="row flex-row-reverse">
                <div className="col-lg-9 col-md-12 col-sm-12 col-12 float-right">
                  <div className="content-page">
                    <div className="box-filters-job">
                      <div className="row">
                        <div className="col-xl-6 col-lg-5">
                          <span className="text-small text-showing">
                            Showing <strong>41-60 </strong>of <strong>944 </strong>jobs
                          </span>
                        </div>
                        <div className="col-xl-6 col-lg-7 text-lg-end mt-sm-15">
                          <div className="display-flex2">
                            <div className="box-border mr-10">
                              <span className="text-sortby">Show:</span>
                              <div className="dropdown dropdown-sort">
                                <button className="btn dropdown-toggle" id="dropdownSort" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static">
                                  <span>12</span>
                                  <i className="fi-rr-angle-small-down" />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownSort">
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item active">10</span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">12</span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">20</span>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="box-border">
                              <span className="text-sortby">Sort by:</span>
                              <div className="dropdown dropdown-sort">
                                <button className="btn dropdown-toggle" id="dropdownSort2" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static">
                                  <span>Newest Post</span>
                                  <i className="fi-rr-angle-small-down" />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownSort2">
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item active">Newest Post</span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">Oldest Post</span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">Rating Post</span>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="box-view-type">
                              <Link href="/jobs-list">
                                <span className="view-type">
                                  <img src="assets/imgs/template/icons/icon-list.svg" alt="jobBox" />
                                </span>
                              </Link>

                              <Link href="/jobs-grid">
                                <span className="view-type">
                                  <img src="assets/imgs/template/icons/icon-grid-hover.svg" alt="jobBox" />
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-1.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Car Toys</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>66</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">New York, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>12</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-2.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Carols Daughter</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>18</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">London, UK</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>25</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-3.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Amazon</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>52</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">Tokyo,Japan</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>54</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-4.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Baseball Savings</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>85</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">Chicago, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>6</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-5.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Ashford</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>25</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">Toronto, Italia</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>67</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-6.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Callaway Golf</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>34</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">San Francisco, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>45</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-7.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Percepta</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>97</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">Chinatown, Singpore</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>64</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-8.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Exela Movers</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>67</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">New York, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>87</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-9.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Ibotta, Inc</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>45</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">New York, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>23</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-1.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Wanderu </span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>08</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">New York, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>45</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-2.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Aceable, Inc.</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>54</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">New York, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>67</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-3.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Intrepid Travel</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>123</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">New York, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>53</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-4.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Defendify </span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>64</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">New York, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>56</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-5.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Twisters </span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>34</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">New York, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>66</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-6.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Fireworks</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>12</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">New York, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>12</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-1.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Car Toys</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>66</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">New York, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>12</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-2.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Carols Daughter</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>18</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">London, UK</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>25</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-3.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Amazon</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>52</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">Tokyo,Japan</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>54</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-4.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Baseball Savings</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>85</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">Chicago, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>6</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-5.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Ashford</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>25</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">Toronto, Italia</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>67</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                          <div className="image-box">
                            <Link href="/company-details">
                              <span>
                                <img src="assets/imgs/brands/brand-6.png" alt="jobBox" />
                              </span>
                            </Link>
                          </div>
                          <div className="info-text mt-10">
                            <h5 className="font-bold">
                              <Link href="/company-details">
                                <span>Callaway Golf</span>
                              </Link>
                            </h5>
                            <div className="mt-5">
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                              <span className="font-xs color-text-mutted ml-10">
                                <span>(</span>
                                <span>34</span>
                                <span>)</span>
                              </span>
                            </div>
                            <span className="card-location">San Francisco, US</span>
                            <div className="mt-30">
                              <Link href="/jobs-grid">
                                <span className="btn btn-grey-big">
                                  <span>45</span>
                                  <span> Jobs Open</span>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="paginations">
                    <ul className="pager">
                      <li>
                        <a className="pager-prev" href="#" />
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">1</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">2</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">3</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">4</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">5</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number active">6</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="pager-number">7</span>
                        </Link>
                      </li>
                      <li>
                        <a className="pager-next" href="#" />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12 col-12">
                  <div className="sidebar-shadow none-shadow mb-30">
                    <div className="sidebar-filters">
                      <div className="filter-block head-border mb-30">
                        <h5>
                          Advance Filter
                          <Link href="#">
                            <span className="link-reset">Reset</span>
                          </Link>
                        </h5>
                      </div>
                      <div className="filter-block mb-30">
                        <div className="form-group select-style select-style-icon">
                          <select className="form-control form-icons select-active">
                            <option>New York, US</option>
                            <option>London</option>
                            <option>Paris</option>
                            <option>Berlin</option>
                          </select>
                          <i className="fi-rr-marker" />
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-15">Industry</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">All</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">180</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Software</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">12</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Finance</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">23</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Recruting</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">43</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Management</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">65</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Advertising</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">76</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-25">Salary Range</h5>
                        <div className="list-checkbox pb-20">
                          <div className="row position-relative mt-10 mb-20">
                            <div className="col-sm-12 box-slider-range">
                              <div id="slider-range" />
                            </div>
                            <div className="box-input-money">
                              <input className="input-disabled form-control min-value-money" type="text" name="min-value-money" disabled={true} defaultValue="" />
                              <input className="form-control min-value" type="hidden" name="min-value" defaultValue="" />
                            </div>
                          </div>
                          <div className="box-number-money">
                            <div className="row mt-30">
                              <div className="col-sm-6 col-6">
                                <span className="font-sm color-brand-1">$0</span>
                              </div>
                              <div className="col-sm-6 col-6 text-end">
                                <span className="font-sm color-brand-1">$500</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group mb-20">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">All</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">145</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$0k - $20k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$20k - $40k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">37</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$40k - $60k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">75</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$60k - $80k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">98</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$80k - $100k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">14</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$100k - $200k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">25</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Popular Keyword</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Software</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">24</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Developer</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">45</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Web</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">57</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Position</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Senior</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">12</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Junior</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">35</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Fresher</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Experience Level</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Internship</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Entry Level</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">87</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Associate</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">24</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Mid Level</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">45</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Director</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">76</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Executive</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">89</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Onsite/Remote</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">On-site</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">12</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Remote</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">65</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Hybrid</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">58</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Job Posted</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">All</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">78</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">1 day</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">65</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">7 days</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">24</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">30 days</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-15">Job type</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Full Time</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">25</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Part Time</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">64</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Remote Jobs</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">78</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Freelancer</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">97</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-50">
            <div className="container">
              <div className="text-start">
                <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">News and Blog</h2>
                <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Get the latest news, updates and tips</p>
              </div>
            </div>
            <div className="container">
              <div className="mt-50">
                <div className="box-swiper style-nav-top">
                  <BlogSlider />
                </div>
                <div className="text-center">
                  <Link href="blog-grid">
                    <span className="btn btn-brand-1 btn-icon-load mt--30 hover-up">Load More Posts</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-20">
            <div className="container">
              <div className="box-newsletter">
                <div className="row">
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img src="assets/imgs/template/newsletter-left.png" alt="joxBox" />
                  </div>
                  <div className="col-lg-12 col-xl-6 col-12">
                    <h2 className="text-md-newsletter text-center">
                      New Things Will Always
                      <br /> Update Regularly
                    </h2>
                    <div className="box-form-newsletter mt-40">
                      <form className="form-newsletter">
                        <input className="input-newsletter" type="text" placeholder="Enter your email here" />
                        <button className="btn btn-default font-heading icon-send-letter">Subscribe</button>
                      </form>
                    </div>
                  </div>
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img src="assets/imgs/template/newsletter-right.png" alt="joxBox" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
