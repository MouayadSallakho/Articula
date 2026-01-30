import React from "react";
import { ourJob } from "../data/MyData";
import { Container, Col, Row, Nav } from "react-bootstrap";

// ⬇️ Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

const CardsOurJob = () => {
  return (
    <div>
      <Container>
        <Swiper
          modules={[Grid, Pagination]}
          slidesPerView={2} // 2 cards per row
          grid={{
            rows: 2, // 2 rows -> 4 cards visible
            fill: "row",
          }}
          slidesPerGroup={4} // 👈 4 slides per "page"
          spaceBetween={24}
          breakpoints={{
            // mobile
            0: {
              slidesPerView: 1.2, // 1 card per row
              grid: { rows: 1 },
              slidesPerGroup: 1, // 1 card per page
            },
            // small tablets
            576: {
              slidesPerView: 1.7, // 1 card per row
              grid: { rows: 1 }, // 2 rows -> 2 cards visible
              slidesPerGroup: 1, // 2 cards per page
            },
            // desktop
            992: {
              slidesPerView: 2.6, // 2 cards per row
              grid: { rows: 1 }, // 2 rows -> 4 cards visible
              slidesPerGroup: 2, // 4 cards per page (8 cards -> 2 bullets)
            },
            1200: {
              slidesPerView: 2, // 2 cards per row
              grid: { rows: 2 }, // 2 rows -> 4 cards visible
              slidesPerGroup: 4, // 4 cards per page (8 cards -> 2 bullets)
            },
          }}
          pagination={{ clickable: true }}
        >
          {ourJob.map((item, index) => (
            <SwiperSlide key={item.id || index}>
              <div className="ourCard">
                <img src={item.ourimage} alt={item.title} />
                <div>
                  <div className="price">
                    <p>{item.badge}</p>
                    <p>
                      {item.price} <span>{item.period}</span>
                    </p>
                  </div>
                  <h5>{item.title}</h5>
                  <span>{item.experience}</span>
                  <span></span>
                  <ul>
                    {item.tags.map((tag, i) => (
                      <li key={i}>{tag}</li>
                    ))}
                  </ul>
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

export default CardsOurJob;
