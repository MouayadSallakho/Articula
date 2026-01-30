import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import cpu from "../assets/images/Cpu.png";
import cpu2 from "../assets/images/Cpu (2).png";

const CardOurCats = () => {
  const [OurCatigoris, setOurCatigoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const getBoxBgClass = (index) => (index % 2 === 0 ? "box-blue" : "box-red");
  const getBoxBgClasss = (index) => (index % 2 === 0 ? cpu : cpu2);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setErrMsg("");

    fetch("https://tamkeen-dev.com/api/terms/category", {})
      .then((res) => {
        if (!res.ok) {
          return res.text().then((txt) => {
            throw new Error(txt || `Request failed (${res.status})`);
          });
        }

        // أحيانًا السيرفر بيرجع content-type مش json
        // فنعمل حماية: نحاول json وإذا فشل نقرأ text
        return res.json().catch(() =>
          res.text().then((t) => {
            throw new Error(
              "Response is not JSON. First 200 chars: " + t.slice(0, 200)
            );
          })
        );
      })
      .then((data) => {
        console.log("CATEGORY API DATA:", data);

        // ✅ دعم أكثر من شكل للـ response
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.data)) list = data.data;
        else if (Array.isArray(data?.items)) list = data.items;

        if (!cancelled) setOurCatigoris(list);
      })
      .catch((e) => {
        console.error("CATEGORY API ERROR:", e);
        if (!cancelled) {
          setErrMsg(e?.message || "Failed to load categories");
          setOurCatigoris([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="Gategorycards">
      <Row>
        {loading ? (
          <div>Loading…</div>
        ) : errMsg ? (
          <div className="text-danger">{errMsg}</div>
        ) : OurCatigoris.length ? (
          <>
            {OurCatigoris.slice(0, 4).map((cat, index) => (
              <Col
                data-aos="fade-right"
                lg={4}
                md={6}
                sm={6}
                key={cat.id ?? index}
              >
                <div className="boss-My-box">
                  <div className="holder-icone">
                    <img src={getBoxBgClasss(index)} alt="CPU" />
                  </div>
                  <div className={`My-box ${getBoxBgClass(index)}`}>
                    <h5>{cat.name}</h5>
                    <p>
                      Discover high-quality articles written by experts and
                      creators.
                    </p>
                  </div>
                </div>
              </Col>
            ))}

            <Col className="md-hide" data-aos="fade-right" lg={4} md={6} sm={6}>
              <div className="boss-My-box">
                <div className="holder-icone">
                  <img src={cpu} alt="CPU" />
                </div>
                <div className="My-box box-blue">
                  <h5>Personal Development</h5>
                  <p>
                    Discover high-quality articles written by experts and
                    creators.
                  </p>
                </div>
              </div>
            </Col>

            <Col className="md-hide" data-aos="fade-right" lg={4} md={6} sm={6}>
              <div className="boss-My-box md-hide">
                <div className="holder-icone">
                  <img src={cpu2} alt="CPU" />
                </div>
                <div className="My-box box-red">
                  <h5>Office Productivity</h5>
                  <p>
                    Discover high-quality articles written by experts and
                    creators.
                  </p>
                </div>
              </div>
            </Col>
          </>
        ) : (
          <div>No categories</div>
        )}
      </Row>
    </div>
  );
};

export default CardOurCats;
