import { useEffect, useState } from "react";
import { Card, Row, Col, Tag } from "antd";
import axios from "axios";

export default function SaleProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/sales/active-products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const calcFinalPrice = (price, percent) => {
    return Math.round(price - (price * percent) / 100);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: 20 }}>🔥 Sản phẩm đang SALE</h2>

      <Row gutter={[20, 20]}>
        {products.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
            <Card hoverable cover={<img alt={p.name} src={p.images?.[0]} />}>
              <Tag color="red" style={{ marginBottom: 10 }}>
                -{p.discountPercent}%
              </Tag>

              <h3>{p.name}</h3>

              <div style={{ marginTop: 10 }}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  {calcFinalPrice(p.price, p.discountPercent).toLocaleString()}{" "}
                  ₫
                </span>

                <br />

                <span
                  style={{
                    fontSize: 14,
                    textDecoration: "line-through",
                    opacity: 0.6,
                  }}
                >
                  {p.price.toLocaleString()} ₫
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
