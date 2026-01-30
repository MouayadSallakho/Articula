import React from "react";
import { Top_writer } from "../data/MyData";
import { Container } from "react-bootstrap";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation"; // ✅ add this

// import required modules
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules"; // ✅ add Navigation

const TopWriter = () => {
  return (
    <div className="">
      <Container>
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          breakpoints={{
            0: {
              slidesPerView: 1.7,
              centeredSlides: true,
            },
            576: {
              slidesPerView: 1.7,
              centeredSlides: true,
            },
            768: {
              slidesPerView: 2,
              centeredSlides: true,
            },
            992: {
              slidesPerView: 3,
              centeredSlides: true,
            },
          }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={false}
          navigation={true}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="mySwiper"
        >
          {Top_writer.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="cardWriter">
                <img src={item.image} alt="Person" />
                <div className="contentAuther">
                  <img src={item.imageForAuther} alt="" />
                  <p>{item.nameOfAuther}</p>
                </div>
                <p>{item.title}</p>
                <span></span>
                <div className="stars">
                  <p>
                    {" "}
                    <FaStar /> {item.percent}
                  </p>
                  <span>
                    {" "}
                    <p>{item.numberArts}</p> Articals
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
  );
};

export default TopWriter;
