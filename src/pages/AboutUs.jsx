import React from "react";
import Header from "../components/Header";
import SlideAboutUs from "../components/SlideAboutUs";

import Bramdssss from "../components/Bramdssss";

import { Container, Row, Col } from "react-bootstrap";
import GroupImages from "../assets/images/Group images.png";
import "./about.css";
import Footer from "../components/Footer";

import { LuNotebook } from "react-icons/lu";
import { GoStack } from "react-icons/go";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import TopTestimo from "../components/TopTestimo";

const AboutUs = () => {
  return (
    <div>
      <Header />
      <SlideAboutUs />
      <div className="underSlideAboutUs">
        <Bramdssss />
      </div>
      <div className="ourGroup">
        <Container>
          <Row>
            <Col lg={6} className="left">
              <img src={GroupImages} alt="GroupImages" />
            </Col>
            <Col lg={6} className="right">
              <h4>We’ve been here almost 15 years</h4>
              <p>
                Fusce lobortis leo augue, sit amet tristique nisi commodo in.
                Aliquam ac libero quis tellus venenatis imperdiet. Sed sed nunc
                libero. Curabitur in urna ligula. torquent per conubia nostra.
              </p>
              <div className="holderInfo">
                <div className="content">
                  <LuNotebook />
                  <div>
                    <p>26k</p>
                    <span>Certified Instructor</span>
                  </div>
                </div>

                <div className="content">
                  <HiOutlineCheckBadge />
                  <div>
                    <p>26k</p>
                    <span>Certified Instructor</span>
                  </div>
                </div>

                <div className="content">
                  <GoStack />
                  <div>
                    <p>26k</p>
                    <span>Certified Instructor</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="TopTestimo">
        <TopTestimo />
      </div>

      <div className="holderFooter">
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
