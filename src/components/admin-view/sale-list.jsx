import { Table, Tag, Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SaleList() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/sales")
      .then((res) => setSales(res.data));
  }, []);

  const deleteSale = async (id) => {
    await axios.delete(`http://localhost:8080/api/admin/sales/${id}`);
    setSales((prev) => prev.filter((s) => s._id !== id));
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Discount",
      dataIndex: "discountPercent",
      render: (percent) => <Tag color="red">{percent}%</Tag>,
    },
    {
      title: "Products",
      dataIndex: "products",
      render: (list) => list.length + " products",
    },
    { title: "Start", dataIndex: "startDate" },
    { title: "End", dataIndex: "endDate" },
    {
      title: "Actions",
      render: (_, record) => (
        <Button danger onClick={() => deleteSale(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return <Table rowKey="_id" dataSource={sales} columns={columns} />;
}
