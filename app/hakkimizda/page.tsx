import Link from "next/link";
import Layout from "@/components/Layout/Layout";

export default function Hakkimizda() {
  return (
    <>
      <Layout>
        <div>
          <section className="section-box">
            <div className="breacrumb-cover bg-img-about">
              <div className="container">
                <div className="row">
                  <div className="col-lg-6">
                    <h2 className="mb-10">Hakkımızda</h2>
                    <p className="font-lg color-text-paragraph-2">Burs platformu hakkında bilgiler</p>
                  </div>
                  <div className="col-lg-6 text-lg-end">
                    <ul className="breadcrumbs mt-40">
                      <li>
                        <Link href="/" className="home-icon">
                          Home
                        </Link>
                      </li>
                      <li>Hakkımızda</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="section-box mt-80">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <h3 className="mb-30">Hakkımızda</h3>
                  <div className="font-lg color-text-paragraph-2">
                    <p className="mb-20">
                      Bu sayfa yakında güncellenecektir. Hakkımızda bilgileri buraya eklenecektir.
                    </p>
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

