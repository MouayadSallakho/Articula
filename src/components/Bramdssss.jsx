import React from "react";

import { Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container, Row, Col } from "react-bootstrap";

import brand1 from "../assets/images/brand1.png";
import brand2 from "../assets/images/brand2.png";
import brand3 from "../assets/images/brand3.png";
import brand4 from "../assets/images/brand4.png";
import brand5 from "../assets/images/brand5.png";

import "../pages/Home.css";

const Bramdssss = () => {
  return (
    <div>
      <div className="holderBramds">
        <Container>
          <Swiper
            spaceBetween={15}
            breakpoints={{
              // mobile
              0: {
                slidesPerView: 2.4,
                slidesPerGroup: 1,
              },
              // small tablets
              576: {
                slidesPerView: 2.5,
                slidesPerGroup: 1,
              },
              768: {
                slidesPerView: 3.5,
                slidesPerGroup: 1,
              },
              // desktop
              992: {
                slidesPerGroup: 1,
                slidesPerView: 5.5,
              },
            }}
            className="mySwiper"
          >
            <SwiperSlide>
              <div data-aos="fade-up" data-aos-duration="1000" className="dd">
                <img src={brand1} alt="brand1" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div data-aos="fade-up" data-aos-duration="1400" className="dd">
                <img src={brand2} alt="brand1" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div data-aos="fade-up" data-aos-duration="1800" className="dd">
                <img src={brand3} alt="brand1" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div data-aos="fade-up" data-aos-duration="2200" className="dd">
                <img src={brand4} alt="brand1" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div data-aos="fade-up" data-aos-duration="2600" className="dd">
                <img src={brand5} alt="brand1" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div data-aos="fade-up" data-aos-duration="3000" className="dd">
                <img src={brand1} alt="brand1" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div data-aos="fade-up" data-aos-duration="3400" className="dd">
                <img src={brand2} alt="brand1" />
              </div>
            </SwiperSlide>
          </Swiper>
        </Container>
      </div>
    </div>
  );
};

export default Bramdssss;
