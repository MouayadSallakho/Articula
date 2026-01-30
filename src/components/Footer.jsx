import React from "react";

import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { NavLink } from "react-router-dom";

import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import logo from "../assets/images/myLogo.png";
import Download1 from "../assets/images/Download our app (2).png";
import Download2 from "../assets/images/Download our app (3).png";

import { Container, Row, Col, Nav } from "react-bootstrap";
const Footer = () => {
  return (
    <div data-aos="fade-up"
     >
      <div className="MyFooter">
        <Container>
          <Row>
            <Col lg={3} md={12} sm={12} className="left">
              <img src={logo} alt="" />
              <p>
                Aliquam rhoncus ligula est, non pulvinar elit convallis nec.
                Donec mattis odio at.
              </p>
              <ul className="social-links">
                <li className="facebook">
                  <Nav.Link className="">
                    <FaFacebookF />
                  </Nav.Link>
                </li>
                <li className="instagram">
                  <Nav.Link className="">
                    <FaInstagram />
                  </Nav.Link>
                </li>
                <li className="linkedin">
                  <Nav.Link className="">
                    <FaLinkedinIn />
                  </Nav.Link>
                </li>
                <li className="twitter">
                  <Nav.Link className="">
                    <FaTwitter />
                  </Nav.Link>
                </li>
                <li className="whatsapp">
                  <Nav.Link className="">
                    <IoLogoWhatsapp />
                  </Nav.Link>
                </li>
              </ul>
            </Col>
            <Col lg={9} className="right">
              <Row>
                <Col lg={3} md={6}  className="col-sm-6 col-6">
                  <p>Top 4 Category</p>
                  <ul>
                    <li>
                      <Nav.Link>
                        Development <MdKeyboardDoubleArrowRight />
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link>
                        Finance & Accounting <MdKeyboardDoubleArrowRight />
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link>
                        Design <MdKeyboardDoubleArrowRight />
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link>
                        Business <MdKeyboardDoubleArrowRight />
                      </Nav.Link>
                    </li>
                  </ul>
                </Col>
                <Col lg={3} md={6} className="col-sm-6 col-6">
                  <p>Quick Links</p>
                  <ul>
                    <li>
                      <Nav.Link>
                        About <MdKeyboardDoubleArrowRight />
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link>
                        Become an author <MdKeyboardDoubleArrowRight />
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link as={NavLink} to="/contact"  >
                        Contact <MdKeyboardDoubleArrowRight />
                      </Nav.Link>




                    </li>
                    <li>
                      <Nav.Link>
                        Career <MdKeyboardDoubleArrowRight />
                      </Nav.Link>
                    </li>
                  </ul>
                </Col>
                <Col lg={3} md={6} className="col-sm-6 col-6" >
                  <p>Support</p>
                  <ul>
                    <li>
                      <Nav.Link>
                        Help Center <MdKeyboardDoubleArrowRight />
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link>
                        FAQs <MdKeyboardDoubleArrowRight />
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link>
                        Terms & Condition <MdKeyboardDoubleArrowRight />
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link>
                        Privacy Policy <MdKeyboardDoubleArrowRight />
                      </Nav.Link>
                    </li>
                  </ul>
                </Col>
                <Col lg={3} md={6} className="col-sm-6 col-6" >
                  <p>Downlaod our app</p>
                  <img src={Download1} alt="Download1" />
                  <img src={Download2} alt="Download2" />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="copyFooter">
        <p>© 2025 - All rights reserved</p>
      </div>
    </div>
  );
};

export default Footer;
