// SlideAboutUs.jsx
import React from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Mousewheel } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import AboutUs1 from "../assets/images/AboutUs1.png";
 import AboutUs2 from "../assets/images/our2.png"
   import AboutUs4 from "../assets/images/our4.png"
const SlideAboutUs = () => {
  return (
    <section className="timeline-section py-5">
      {/* هذا الكونتينر للتريك: نص اليسار يكون مضبوط، 
          والصورة اليمين منضبطها لاحقاً بالـ CSS */}
      <div className="container">
        <Swiper
          className="outswiper"
          modules={[Pagination]}
          slidesPerView={1}
          spaceBetween={40}
          pagination={{ clickable: true }}
        >
          {/* سلايد 1 */}
          <SwiperSlide>
            <div className="row align-items-center holder-right-left">
              {/* اليسار: النص */}
              <div data-aos="fade-right" className=" left col-lg-6">
                <p className="">2011 - 2025</p>
                <h2 className="">
                  We share knowledge <br /> with the world
                </h2>
                <span>
                  
                </span>
                <p className="">
                  Interdum et malesuada fames ac ante ipsum primis in faucibus.
                  Praesent fermentum quam mauris. Fusce tempor et augue a
                  aliquet.
                </p>
              </div>

              {/* اليمين: هون رح يكون السويبر الداخلي العمودي للصور */}
              <div data-aos="fade-left" className=" right col-lg-6">
                <div
                  className="inner-slider-wrapper"
                  style={{
                    height: "320px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Swiper
                    direction="vertical"
                    modules={[Pagination]} // مهم جداً
                    mousewheel={{ forceToAxis: true }} // سكرول لفوق/تحت
                    pagination={{ clickable: true }} // تفعيل الباغينيشن
                    slidesPerView={1}
                    spaceBetween={20}
                    className="inner-swiper "
                    style={{ height: "100%" }}
                  >
                    <SwiperSlide>
                      <div className=" h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs1} // حط مسار الصورة الحقيقية
                          className=""
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs2} // حط مسار الصورة الحقيقية
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs4} // حط مسار الصورة الحقيقية
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </SwiperSlide>
          {/* سلايد 2 */}
          <SwiperSlide>
            <div className="row align-items-center">
              {/* اليسار: النص */}
              <div className="col-md-6 left">
                <p className="text-muted mb-2">2011 - 2025</p>
                <h2 className="fw-bold mb-3">
                  We share knowledge <br /> with the world
                </h2>
                <hr className="mb-3" />
                <p className="text-secondary">
                  Interdum et malesuada fames ac ante ipsum primis in faucibus.
                  Praesent fermentum quam mauris. Fusce tempor et augue a
                  aliquet.
                </p>

                {/* هون بعدين منضيف النقاط العمودية (الـ pagination العمودي) */}
              </div>

              {/* اليمين: هون رح يكون السويبر الداخلي العمودي للصور */}
              <div className="col-md-6 right">
                <div
                  className="inner-slider-wrapper"
                  style={{
                    height: "320px",
                    // background: 'linear-gradient(#d9c7ff 50%, #f5e9c9 50%)',
                    // borderRadius: '16px',
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Swiper
                    direction="vertical"
                    modules={[Pagination, Mousewheel]} // مهم جداً
                    mousewheel={{ forceToAxis: true }} // سكرول لفوق/تحت
                    pagination={{ clickable: true }} // تفعيل الباغينيشن
                    slidesPerView={1}
                    spaceBetween={20}
                    className="inner-swiper "
                    style={{ height: "100%" }}
                  >
                    <SwiperSlide>
                      <div className=" h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs1} // حط مسار الصورة الحقيقية
                          className=""
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs1} // حط مسار الصورة الحقيقية
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs1} // حط مسار الصورة الحقيقية
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </SwiperSlide>
          {/* سلايد31 */}
          <SwiperSlide>
            <div className="row align-items-center">
              {/* اليسار: النص */}
              <div className="col-md-6 left">
                <p className="text-muted mb-2">2011 - 2025</p>
                <h2 className="fw-bold mb-3">
                  We share knowledge <br /> with the world
                </h2>
                <hr className="mb-3" />
                <p className="text-secondary">
                  Interdum et malesuada fames ac ante ipsum primis in faucibus.
                  Praesent fermentum quam mauris. Fusce tempor et augue a
                  aliquet.
                </p>

                {/* هون بعدين منضيف النقاط العمودية (الـ pagination العمودي) */}
              </div>

              {/* اليمين: هون رح يكون السويبر الداخلي العمودي للصور */}
              <div className="col-md-6 right">
                <div
                  className="inner-slider-wrapper"
                  style={{
                    height: "320px",
                    // background: 'linear-gradient(#d9c7ff 50%, #f5e9c9 50%)',
                    // borderRadius: '16px',
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Swiper
                    direction="vertical"
                    modules={[Pagination, Mousewheel]} // مهم جداً
                    mousewheel={{ forceToAxis: true }} // سكرول لفوق/تحت
                    pagination={{ clickable: true }} // تفعيل الباغينيشن
                    slidesPerView={1}
                    spaceBetween={20}
                    className="inner-swiper "
                    style={{ height: "100%" }}
                  >
                    <SwiperSlide>
                      <div className=" h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs1} // حط مسار الصورة الحقيقية
                          className=""
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs1} // حط مسار الصورة الحقيقية
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs1} // حط مسار الصورة الحقيقية
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* سلايد 4 */}

          <SwiperSlide>
            <div className="row align-items-center">
              {/* اليسار: النص */}
              <div className="col-md-6 left">
                <p className="text-muted mb-2">2011 - 2025</p>
                <h2 className="fw-bold mb-3">
                  We share knowledge <br /> with the world
                </h2>
                <hr className="mb-3" />
                <p className="text-secondary">
                  Interdum et malesuada fames ac ante ipsum primis in faucibus.
                  Praesent fermentum quam mauris. Fusce tempor et augue a
                  aliquet.
                </p>

                {/* هون بعدين منضيف النقاط العمودية (الـ pagination العمودي) */}
              </div>

              {/* اليمين: هون رح يكون السويبر الداخلي العمودي للصور */}
              <div className="col-md-6 right">
                <div
                  className="inner-slider-wrapper"
                  style={{
                    height: "320px",
                    // background: 'linear-gradient(#d9c7ff 50%, #f5e9c9 50%)',
                    // borderRadius: '16px',
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Swiper
                    direction="vertical"
                    modules={[Pagination, Mousewheel]} // مهم جداً
                    mousewheel={{ forceToAxis: true }} // سكرول لفوق/تحت
                    pagination={{ clickable: true }} // تفعيل الباغينيشن
                    slidesPerView={1}
                    spaceBetween={20}
                    className="inner-swiper "
                    style={{ height: "100%" }}
                  >
                    <SwiperSlide>
                      <div className=" h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs1} // حط مسار الصورة الحقيقية
                          className=""
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs1} // حط مسار الصورة الحقيقية
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="h-100 d-flex justify-content-center ">
                        <img
                          src={AboutUs1} // حط مسار الصورة الحقيقية
                          alt="Slide 1"
                          style={{ maxHeight: "100%" }}
                        />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default SlideAboutUs;
