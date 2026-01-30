import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FiPhoneCall } from "react-icons/fi";
import { LiaFaxSolid } from "react-icons/lia";
import { HiOutlineMailOpen } from "react-icons/hi";
import Form from "react-bootstrap/Form";

const Location = () => {
  return (
    <div className="holderinfolocation">
      <Container>
        <Row>
          <Col className="left">
            <h3>Contact US</h3>
            <p>
              Enim tempor eget pharetra facilisis sed maecenas adipiscing. Eu
              leo molestie vel, ornare non id blandit netus.
            </p>

            <div className="fullName">
              <input type="text" placeholder="First Name *" required />
              <input type="text" placeholder="Last Name *" required />
            </div>

            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Subject" />

            <Form.Select aria-label="Default select example">
              <option>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Select>

            <textarea placeholder="Message" />

            <button>SEND</button>

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

          <Col className="right"></Col>
        </Row>
      </Container>
    </div>
  );
};

export default Location;
