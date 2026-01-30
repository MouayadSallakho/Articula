import React from 'react'
import { Container , Col , Row } from 'react-bootstrap'

import { MdKeyboardDoubleArrowRight } from "react-icons/md";


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Pagination, Navigation } from 'swiper/modules';


import heroslid from "../assets/images/heroJop.png"

import "../pages/Jops.css"


const SlideJobsHero = () => {
  return (
    <div className='heroslides'>
              <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, ]}
        className="mySwiper"
      >
        <SwiperSlide>
            <div className='JoinSlid'>
                <Container>
                    <div  data-aos="fade-right" className='lefts'>
                        <h2 >Join the most incredible & creative team.</h2>
                        <p>Proin gravida enim augue, dapibus ultrices eros feugiat et. Pellentesque bibendum orci felis, sit amet efficitur felis lacinia ac. Mauris gravida justo ac nunc consectetur.</p>
                        <button>
                            <p>View Open Positions</p>
                            <span><MdKeyboardDoubleArrowRight /></span>
                        </button>
                    </div>
                    <div data-aos="fade-left" className='rights'>
                        <img src={heroslid} alt="" />
                    </div>
                </Container>
            </div>
        </SwiperSlide>
             <SwiperSlide>
            <div className='JoinSlid'>
                <Container>
                    <div className='lefts'>
                        <h2>Join the most incredible & creative team.</h2>
                        <p>Proin gravida enim augue, dapibus ultrices eros feugiat et. Pellentesque bibendum orci felis, sit amet efficitur felis lacinia ac. Mauris gravida justo ac nunc consectetur.</p>
                        <button>
                            <p>View Open Positions</p>
                            <span><MdKeyboardDoubleArrowRight /></span>
                        </button>
                    </div>
                    <div className='rights'>
                        <img src={heroslid} alt="" />
                    </div>
                </Container>
            </div>
        </SwiperSlide>
             <SwiperSlide>
            <div className='JoinSlid'>
                <Container>
                    <div className='lefts'>
                        <h2>Join the most incredible & creative team.</h2>
                        <p>Proin gravida enim augue, dapibus ultrices eros feugiat et. Pellentesque bibendum orci felis, sit amet efficitur felis lacinia ac. Mauris gravida justo ac nunc consectetur.</p>
                        <button>
                            <p>View Open Positions</p>
                            <span><MdKeyboardDoubleArrowRight /></span>
                        </button>
                    </div>
                    <div className='rights'>
                        <img src={heroslid} alt="" />
                    </div>
                </Container>
            </div>
        </SwiperSlide>

      </Swiper>
    </div>
  )
}

export default SlideJobsHero