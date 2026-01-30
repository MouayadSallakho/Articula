import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaLongArrowAltLeft } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";

import { FaLongArrowAltRight } from "react-icons/fa";

// import required modules
import { Pagination, Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import For get my data from JS to JSX

import { MyData } from "../data/MyData";
import HeroSlideFromHomePage from "../components/HeroSlideFromHomePage";

// Import Icons
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

import CardOurCats from "../components/CardOurCats";

import ArtsHomePage from "../components/ArtsHomePage.jsx";

import Header from "../components/Header";
import TopWriter from "../components/TopWriter";
import CardsOurJob from "../components/CardsOurJob";
import Footer from "../components/Footer";
import Bramdssss from "../components/Bramdssss";
import "./Home.css";

const Home = () => {
  return (
    <div>
      {/* Start Header  */}
      {/* Start Header  */}
      {/* Start Header  */}

      <div>
        <Header />
      </div>

      {/* End Header  */}
      {/* End Header  */}
      {/* End Header  */}

      {/* Start hero_Section */}
      {/* Start hero_Section */}
      {/* Start hero_Section */}

      <section className="hero_Section">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop
          autoplay={{ delay: 1000 }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination]}
          className="mySwiper"
        >
          {MyData.map((s) => (
            <SwiperSlide key={s.id}>
              <HeroSlideFromHomePage {...s} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* End hero_Section */}
      {/* End hero_Section */}
      {/* End hero_Section */}

      {/* Start OurArtical_Categorie */}
      {/* Start OurArtical_Categorie */}
      {/* Start OurArtical_Categorie */}

      <section className="OurArtical_Categories">
        <Container>
          <div className="head">
            <div>
              <Nav.Link className="d-flex align-items-center gap-1">
                
                <span><FaLongArrowAltLeft /></span> <p> Browse All</p>
              </Nav.Link>
              <p>We have more category & subcategory.</p>
            </div>
            <h2>
              Browse Our Articles <span>Categories</span>
            </h2>
          </div>
          <div className="containerCats">
            <CardOurCats />
          </div>
        </Container>
      </section>

      {/* End  OurArtical_Categorie */}
      {/* End  OurArtical_Categorie */}
      {/* End  OurArtical_Categorie */}

      {/* Start Latest Articles */}
      {/* Start Latest Articles */}
      {/* Start Latest Articles */}
      <section className="Latest_Articles">
        <div className="address">
          <h2>Latest Articles</h2>
        </div>
        <div className="HeadlatestArts">
          <ArtsHomePage />
        </div>
      </section>
      {/* End Latest Articles */}
      {/* End Latest Articles */}
      {/* End Latest Articles */}

      {/* Start Top-Writers */}
      {/* Start Top-Writers */}
      {/* Start Top-Writers */}

      <section className="Top-Writers">
        <Container>
          <div className="Head_Top_Writer">
            <h2>Check out our Top Writers</h2>
            <p>
              Thousands of users waiting for a Articles. Start writing & earning
              now!.
              <Nav.Link className="d-flex align-items-center gap-1">
                Browse All <FaLongArrowAltRight /></Nav.Link>
            </p>
          </div>
        </Container>

        <div>
          <TopWriter />
        </div>
      </section>

      {/* End Top-Writers  */}
      {/* End Top-Writers  */}
      {/* End Top-Writers  */}

      {/* Start Our Job */}
      {/* Start Our Job */}
      {/* Start Our Job */}

      <section className="OurJop">
        <div className="address">
          <h2>Our Job Opprtunities</h2>
        </div>
        <div className="Content">
          <CardsOurJob />
        </div>
      </section>
      {/* End Our Job  */}
      {/* End Our Job  */}
      {/* End Our Job  */}

      {/* Start  Our Partners */}
      {/* Start  Our Partners */}
      {/* Start  Our Partners */}
      <section className="Partners">
        <div className="address">
          <h2>
            Our <span>Partners</span>
          </h2>
        </div>

        <Bramdssss />
      </section>
      {/* End  Our Partners  */}
      {/* End  Our Partners  */}
      {/* End  Our Partners  */}

      {/* Start Footer */}
      {/* Start Footer */}
      {/* Start Footer */}
      <Footer />
      {/* End Footrer */}
      {/* End Footrer */}
      {/* End Footrer */}
    </div>
  );
};

export default Home;
