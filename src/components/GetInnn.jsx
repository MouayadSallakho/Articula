import React from "react";
import { Container , Row , Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";


import { MdOutlineEmail } from "react-icons/md";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';



// import required modules
import { Pagination } from 'swiper/modules';

const GetInnn = () => {
  return (
    <div>
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        <SwiperSlide>
                  <div className="GetIn">
        <Container>
          <h4 data-aos="fade-right" data-aos-duration="1000" >Get In touch</h4>
          <p data-aos="fade-right" data-aos-duration="2000">
            want to get in touch ? we’d love to hear from you heres how you can
            reach us .
          </p>
          <button data-aos="fade-right" data-aos-duration="3000">
            <MdOutlineEmail /> Copy Email
          </button>
        </Container>
      </div>
        </SwiperSlide>
        <SwiperSlide>
                  <div className="GetIn">
        <Container>
          <h4>Get In touch</h4>
          <p>
            want to get in touch ? we’d love to hear from you heres how you can
            reach us .
          </p>
          <button>
            <MdOutlineEmail /> Copy Email
          </button>
        </Container>
      </div>
        </SwiperSlide>
        <SwiperSlide>
                  <div className="GetIn">
        <Container>
          <h4>Get In touch</h4>
          <p>
            want to get in touch ? we’d love to hear from you heres how you can
            reach us .
          </p>
          <button>
            <MdOutlineEmail /> Copy Email
          </button>
        </Container>
      </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default GetInnn;
