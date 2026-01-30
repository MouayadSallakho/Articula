import React from "react";
import { TopTest } from "../data/MyData";

import { RiDoubleQuotesL } from "react-icons/ri";
import { RiDoubleQuotesR } from "react-icons/ri";
import { Pagination, Navigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container , Row ,Col } from 'react-bootstrap';



const TopTestimo = () => {
  return (
    <div className="TopTestimonials">

    <div className="holderAdress">
        <h2>
            Top Testimonials
        </h2>
    </div>
      <Container>
        <Swiper
          spaceBetween={42}
          breakpoints={{
            // mobile
            0: {
              slidesPerView: 1.4,
              slidesPerGroup: 1,
            },
            // small tablets
            576: {
              slidesPerView: 1.8,
              slidesPerGroup: 1,
            },
            768: {
              slidesPerView: 2.4,
              slidesPerGroup: 1,
            },

            // desktop
            992: {
              slidesPerGroup: 1,
              slidesPerView: 2.7,
            },
          }}
          className="mySwiper"
        >
          {TopTest.map((item, index) => (
            <SwiperSlide key={item.id || index}>
              <div className="Box-Data">
                <div className="title">
                                   <RiDoubleQuotesL />
                <p>{item.title}</p>
                <RiDoubleQuotesR />
                </div>
                <div>
                  <p>{item.parag}</p>
                  <span>{item.spans}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
  );
};

export default TopTestimo;
