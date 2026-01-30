import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Container, Row, Col } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Accordion from "react-bootstrap/Accordion";

import "./FaqPage.css";
import Footer from "../components/Footer";

// TODO: adjust to your real endpoints:
const FAQ_API = "https://tamkeen-dev.com/api/faq-list"; // <-- first API (big JSON)
const FAQ_CATEGORIES_API = "https://tamkeen-dev.com/api/terms/faq-category"; // <-- second API

const FaqPage = () => {
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [faqRes, catRes] = await Promise.all([
          fetch(FAQ_API),
          fetch(FAQ_CATEGORIES_API),
        ]);

        if (!faqRes.ok || !catRes.ok) {
          throw new Error("Failed to load FAQs");
        }

        const [faqData, catData] = await Promise.all([
          faqRes.json(),
          catRes.json(),
        ]);

        setFaqs(faqData);
        setCategories(catData);

        // Select first category by default
        if (catData.length > 0) {
          setSelectedCategoryId(catData[0].id); // ids are strings: "11", "12", ...
        }
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
  };

  // Only FAQs that belong to the selected category
  const filteredFaqs = selectedCategoryId
    ? faqs.filter((faq) => faq.category_id === selectedCategoryId)
    : faqs;

 if (loading) {
  return (
    <div className="FAQHERO">
      <Header />

      <div className="path-The-Page">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item className="bread-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>FAQs</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      <div className="Fillter">
        <Container>
          <Row className="g-4">
            {/* Left skeleton */}
            <Col lg={4} md={5}>
              <h3>Categories</h3>
              <div className="faq-skel-card">
                <div className="faq-skel-line w70" />
                <div className="faq-skel-line w90" />
                <div className="faq-skel-line w80" />
                <div className="faq-skel-line w60" />
                <div className="faq-skel-line w85" />
              </div>
            </Col>

            {/* Right skeleton */}
            <Col lg={8} md={7}>
              <h3>FAQs</h3>
              <div className="faq-skel-card">
                <div className="faq-skel-acc">
                  <div className="faq-skel-accHead">
                    <div className="faq-skel-line w80" />
                    <div className="faq-skel-dot" />
                  </div>
                  <div className="faq-skel-accBody">
                    <div className="faq-skel-line w90" />
                    <div className="faq-skel-line w85" />
                    <div className="faq-skel-line w60" />
                  </div>
                </div>

                <div className="faq-skel-acc">
                  <div className="faq-skel-accHead">
                    <div className="faq-skel-line w75" />
                    <div className="faq-skel-dot" />
                  </div>
                  <div className="faq-skel-accBody">
                    <div className="faq-skel-line w88" />
                    <div className="faq-skel-line w70" />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </div>
  );
}

  if (error) return <p>{error}</p>;

  return (
    <div className="FAQHERO">
      <Header />

      <div className="path-The-Page">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item className="bread-item" href="#">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>FAQs</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      <div className="Fillter">
        <Container>
          <Row>
            {/* Left side: Categories */}
            <Col lg={4} md={5}>
              <h3>Categories</h3>
              <ul className="faq-category-list">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={
                      cat.id === selectedCategoryId
                        ? "faq-category-item active-category"
                        : "faq-category-item"
                    }
                  >
                    {cat.name}
                  </li>
                ))}
                {/* <li className="faq-category-item">Hello World</li>
                <li className="faq-category-item">Hello World</li> */}
              </ul>
            </Col>

            {/* Right side: FAQs */}
            <Col lg={8} md={7}>
              <h3>FAQs</h3>

              {filteredFaqs.length === 0 ? (
                <p>No FAQs in this category yet.</p>
              ) : (
                // defaultActiveKey="0"
                // defaultActiveKey="0"
                // defaultActiveKey="0"
                // defaultActiveKey="0"
                // defaultActiveKey="0"

                <div className="faq-accordion-wrap">
                                  <Accordion>
                  {filteredFaqs.map((faq, index) => (
                    <Accordion.Item
                      eventKey={String(index)}
                      key={`${faq.category_id}-${index}`}
                    >
                      <Accordion.Header>{faq.title}</Accordion.Header>
                      <Accordion.Body>
                        <div
                          // body is HTML from API
                          dangerouslySetInnerHTML={{ __html: faq.body }}
                        />
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}


                </Accordion>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default FaqPage;
