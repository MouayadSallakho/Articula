import { Container, Nav } from "react-bootstrap";

// import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { DataArts } from "../data/MyData";

const ArtsHomePage = () => {
  return (
    <div>
      <Container>
        <Swiper
          spaceBetween={20}
          className="mySwiper"
          breakpoints={{
            320: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 4 }, // ✅ 4 cards together on desktop
          }}
        >
          {DataArts.map((item) => (
            <SwiperSlide key={item.id}>
              <div
                data-aos="fade-up"
                data-aos-duration="3000"
                className={`cardArt ${
                  item.id % 2 !== 0 ? "cardodd" : "cardeven"
                }`}
              >
                <img src={item.image} alt="asdsd" />
                <div>
                  <p>{item.typeArtical}</p>
                </div>
                <span>{item.title}</span>
                <span></span>
                <div>
                  <img src={item.imageForAuther} alt="" />
                  <span>{item.nameOfAuther}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="View">
          <Nav.Link>View More</Nav.Link>
        </div>
      </Container>
    </div>
  );
};

export default ArtsHomePage;
