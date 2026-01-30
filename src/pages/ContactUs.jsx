import React from "react";
import Header from "../components/Header";
import { Container, Nav } from "react-bootstrap";
import { MdOutlineEmail } from "react-icons/md";

import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

import Footer from "../components/Footer";

import "./ContactUs.css";
import GetInnn from "../components/GetInnn";
import OurBranchess from "../components/OurBranchess";
import Locationsend from "../components/Locationsend";

const ContactUs = () => {
  return (
    <div>
      <Header />

      <div className="holderGitIn">
        <GetInnn />
      </div>

      <div className="OurBranches">
        <Container>
          <div className="head">
            <div>
              <Nav.Link>
                <HiOutlineArrowNarrowLeft /> Browse All
              </Nav.Link>
              <p>We have more category & subcategory.</p>
            </div>
            <h2>
              Browse Our Articles <span>Categories</span>
            </h2>
          </div>

          <OurBranchess />
        </Container>

        <Locationsend />
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
