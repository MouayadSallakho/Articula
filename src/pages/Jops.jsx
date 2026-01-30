import React from "react";
import Header from "../components/Header";
import { Container, Row, Col } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import forsvg1 from "../assets/images/forsvg1.png";
import forsvg2 from "../assets/images/forsvg2.png";
import forsvg3 from "../assets/images/forsvg3.png";
import forsvg4 from "../assets/images/forsvg4.png";

import "./Jops.css";
import SlideJobsHero from "../components/SlideJobsHero";
import JoinUsGuys from "../components/JoinUsGuys";
import CardsOurJob from "../components/CardsOurJob";
import Footer from "../components/Footer";

const Jops = () => {
  return (
    <div>
      <Header />

      <div className="heroJops">
        <div className="path-The-Page">
          <Container>
            <Breadcrumb>
              <Breadcrumb.Item className="bread-item" href="/">
                Homee
              </Breadcrumb.Item>

              <Breadcrumb.Item className="active" active>
                Our Jobs
              </Breadcrumb.Item>
            </Breadcrumb>
          </Container>
        </div>
      </div>

      <SlideJobsHero />

      <div>
        <JoinUsGuys />
      </div>

      <div className="perks-wrapper">
        <div className="perks-grid">
          <Container>
            <Row>
              <Col lg={3} className="col-md-6 col-sm-6">
                <div className="perk-item">
                  <img src={forsvg1} alt="" />
                  <p>Personal Career Growth</p>
                  <span>
                    Quisque leo leo, suscipit sed arcu sit amet, iaculis feugiat
                    felis. Vestibulum non consectetur tortor. Morbi at orci
                    vehicula, vehicula mi ut, vestibulum odio.
                  </span>
                </div>
              </Col>

              <Col lg={3} className="col-md-6 col-sm-6">
                <div className="perk-item">
                  <img src={forsvg2} alt="" />
                  <p>Personal Career Growth</p>
                  <span>
                    Quisque leo leo, suscipit sed arcu sit amet, iaculis feugiat
                    felis. Vestibulum non consectetur tortor. Morbi at orci
                    vehicula, vehicula mi ut, vestibulum odio.
                  </span>
                </div>
              </Col>

              <Col lg={3} className="col-md-6 col-sm-6">
                <div className="perk-item">
                  <img src={forsvg3} alt="" />
                  <p>Personal Career Growth</p>
                  <span>
                    Quisque leo leo, suscipit sed arcu sit amet, iaculis feugiat
                    felis. Vestibulum non consectetur tortor. Morbi at orci
                    vehicula, vehicula mi ut, vestibulum odio.
                  </span>
                </div>
              </Col>

              <Col lg={3} className="col-md-6 col-sm-6">
                <div className="perk-item">
                  <img src={forsvg4} alt="" />
                  <p>Personal Career Growth</p>
                  <span>
                    Quisque leo leo, suscipit sed arcu sit amet, iaculis feugiat
                    felis. Vestibulum non consectetur tortor. Morbi at orci
                    vehicula, vehicula mi ut, vestibulum odio.
                  </span>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <section className="OurJop">
        <div className="address">
          <h2>Our Job Opprtunities</h2>
        </div>

        <div className="Content">
          <CardsOurJob />
        </div>
      </section>

      <div className="height"></div>
      <Footer />
    </div>
  );
};

export default Jops;
