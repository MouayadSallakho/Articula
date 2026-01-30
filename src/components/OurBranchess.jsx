import React from "react";
import image1 from "../assets/images/Rectangle1.png";
import image2 from "../assets/images/Rectangle2.png";
import image3 from "../assets/images/Rectangle3.png";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";

const OurBranchess = () => {
  return (
    <div className="HolderOurBranchess">
      <Swiper
      
              navigation={true}
        modules={[Navigation]}
        className="mySwiper"
        slidesPerView={3}      
        slidesPerGroup={3}    
        spaceBetween={20}      


            breakpoints={{
    // mobile
    0: {
      slidesPerView: 1.4,        // 1 card per row
  
      slidesPerGroup: 1,       // 1 card per page
    },
    // small tablets
    768: {
      slidesPerView: 2.2,        // 1 card per row

      slidesPerGroup: 1,       // 2 cards per page
    },
    // desktop
    992: {
      slidesPerView: 3,        // 2 cards per row
 
      slidesPerGroup: 3,       // 4 cards per page (8 cards -> 2 bullets)
    },
        1200: {
      slidesPerView: 3,        // 2 cards per row
  
      slidesPerGroup: 3,       // 4 cards per page (8 cards -> 2 bullets)
    },
  }}



        >
        <SwiperSlide >
          <div className="BBox">
            <img src={image1} alt="" />
            <div>
              <p>Dubai. UAE</p>
            </div>
            <div>
              <p>Lorem Ipsum doller Duis aute irure, No. 6548</p>
            </div>
          </div>
               </SwiperSlide>
                  <SwiperSlide>
          <div className="BBox">
            <img src={image2} alt="" />
            <div>
              <p>Dubai. UAE</p>
            </div>
            <div>
              <p>Lorem Ipsum doller Duis aute irure, No. 6548</p>
            </div>
          </div>
                 </SwiperSlide>
                   <SwiperSlide>
          <div className="BBox">
            <img src={image3} alt="" />
            <div>
              <p>Dubai. UAE</p>
            </div>
            <div>
              <p>Lorem Ipsum doller Duis aute irure, No. 6548</p>
            </div>
          </div>
        </SwiperSlide>


                <SwiperSlide>
          <div className="BBox">
            <img src={image1} alt="" />
            <div>
              <p>Dubai. UAE</p>
            </div>
            <div>
              <p>Lorem Ipsum doller Duis aute irure, No. 6548</p>
            </div>
          </div>
               </SwiperSlide>
                  <SwiperSlide>
          <div className="BBox">
            <img src={image2} alt="" />
            <div>
              <p>Dubai. UAE</p>
            </div>
            <div>
              <p>Lorem Ipsum doller Duis aute irure, No. 6548</p>
            </div>
          </div>
                 </SwiperSlide>
                   <SwiperSlide>
          <div className="BBox">
            <img src={image3} alt="" />
            <div>
              <p>Dubai. UAE</p>
            </div>
            <div>
              <p>Lorem Ipsum doller Duis aute irure, No. 6548</p>
            </div>
          </div>
        </SwiperSlide>
        


      </Swiper>
    </div>
  );
};

export default OurBranchess;
