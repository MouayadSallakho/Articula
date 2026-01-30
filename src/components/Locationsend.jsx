import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FiPhoneCall } from "react-icons/fi";
import { LiaFaxSolid } from "react-icons/lia";
import { HiOutlineMailOpen } from "react-icons/hi";
import Form from "react-bootstrap/Form";

const Locationsend = () => {
  return (
    <div className="holderinfolocation">
      <Container>
        <Row>
          <Col  data-aos="fade-right" lg={6}  className="left ">
            <form action="">
                          <h3>Contact US</h3>
            <p>
              Enim tempor eget pharetra facilisis sed maecenas adipiscing. Eu
              leo molestie vel, ornare non id blandit netus.
            </p>

            <div className="fullName">
              <div className="firstname">
                <input type="text" placeholder="First Name" required />
              </div>
              <div className="lastname">
                <input type="text" placeholder="Last Name" required />
              </div>
            </div>

            <div className="email">
              <input type="email" placeholder="Email" />
            </div>
            <div className="subject">
              <input type="text" placeholder="Subject" />
            </div>



            <div className="text">
              <textarea placeholder="Message" />
            </div>

            <button>SEND</button>

            </form>
            <div className="ourinfo">
              <div className="info">
                <FiPhoneCall />
                <div>
                  <p>PHONE</p>
                  <span>03 5432 1234</span>
                </div>
              </div>

              <div className="info">
                <LiaFaxSolid />
                <div>
                  <p>FAX</p>
                  <span>03 5432 1234</span>
                </div>
              </div>

              <div className="info">
                <HiOutlineMailOpen />
                <div>
                  <p>EMAIL</p>
                  <span>info@marcc.com.au</span>
                </div>
              </div>
            </div>
          </Col>

          <Col data-aos="fade-left" lg={6} className="right">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4373.273385336933!2d4.2426928671991755!3d52.03572347555001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b16338be0a37%3A0x822bcbfecd341ff2!2sDe%20Uithof!5e0!3m2!1sar!2snl!4v1764011983194!5m2!1sar!2snl"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Locationsend;
