import React from "react";
import { Table, Button, Image, Space, Tag } from "antd";

function AdminProductTable({
  products = [],
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => <strong>{index + 1}</strong>,
      width: 80,
      align: "center",
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <Image
          src={images?.[0]}
          alt="product"
          width={80}
          height={80}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => <strong>{category}</strong>,
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      render: (brand) => <strong>{brand}</strong>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description) => <strong>{description}</strong>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price, record) => (
        <span
          style={{
            textDecoration: record.salePrice > 0 ? "line-through" : "none",
            color: record.salePrice > 0 ? "#999" : "#1890ff",
          }}
        >
          ${price}
        </span>
      ),
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (salePrice) =>
        salePrice > 0 ? (
          <Tag color="red">${salePrice}</Tag>
        ) : (
          <Tag color="default">—</Tag>
        ),
    },
    {
      title: "Tồn kho",
      dataIndex: "totalStock",
      key: "totalStock",
      render: (totalStock) => <strong>{totalStock}</strong>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(record?._id);
              setFormData(record);
            }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record?._id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={products}
      pagination={{ pageSize: 5 }}
      bordered
    />
  );
}

export default AdminProductTable;
