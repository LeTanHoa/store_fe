import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  List,
  Avatar,
  Rate,
  Table,
} from "antd";
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  MessageOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { fetchAllUsers } from "@/store/admin/user-slice";
import axios from "axios";
import RevenueChart from "./revenuechart";
import SaleForm from "@/components/admin-view/sale-form";
import SaleList from "@/components/admin-view/sale-list";

const { Title } = Typography;

function AdminDashboard() {
  const dispatch = useDispatch();
  const [allReviews, setAllReviews] = useState([]);
  const { orderList } = useSelector((state) => state.adminOrder);
  const { productList } = useSelector((state) => state.adminProducts);
  const { userList } = useSelector((state) => state.adminUser);

  const fetchAllReviews = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/shop/review/all");
      setAllReviews(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi tải đánh giá:", err);
    }
  };

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
    dispatch(fetchAllProducts());
    dispatch(fetchAllUsers());
    fetchAllReviews();
  }, [dispatch]);

  // 🧮 Tính toán dữ liệu thống kê
  const totalProducts = productList?.length || 0;
  const totalOrders = orderList?.length || 0;
  const filterUser = userList?.filter((user) => user.role !== "admin");
  const totalUsers = filterUser?.length || 0;
  const productDelivered = orderList?.filter(
    (o) => o.orderStatus === "delivered"
  );

  const totalRevenue = productDelivered?.reduce(
    (acc, order) => acc + (order?.totalAmount || 0),
    0
  );

  const revenueData = orderList.reduce((acc, order) => {
    if (order.orderStatus === "delivered") {
      const date = new Date(order.orderDate).toLocaleDateString("vi-VN");
      const existing = acc.find((item) => item.date === date);
      if (existing) {
        existing.revenue += order.totalAmount;
      } else {
        acc.push({ date, revenue: order.totalAmount });
      }
    }
    return acc;
  }, []);

  // 📊 Dữ liệu cho biểu đồ doanh thu theo trạng thái đơn hàng
  const chartData = [
    {
      name: "Đã xác nhận",
      value:
        orderList?.filter((o) => o.orderStatus === "confirmed").length || 0,
    },
    {
      name: "Đang chờ",
      value: orderList?.filter((o) => o.orderStatus === "pending").length || 0,
    },
    {
      name: "Đang xử lý",
      value:
        orderList?.filter((o) => o.orderStatus === "inProcess").length || 0,
    },
    {
      name: "Đang giao",
      value:
        orderList?.filter((o) => o.orderStatus === "inShipping").length || 0,
    },
    {
      name: "Đã giao",
      value:
        orderList?.filter((o) => o.orderStatus === "delivered").length || 0,
    },
    {
      name: "Đã hủy",
      value: orderList?.filter((o) => o.orderStatus === "rejected").length || 0,
    },
  ];

  // 🕐 Lấy 5 đánh giá mới nhất
  const latestReviews = [...allReviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // 🛍️ Chuẩn bị dữ liệu bảng “3 sản phẩm được mua gần nhất”
  const allProducts = orderList.flatMap((order) =>
    order.cartItems.map((item) => ({
      productId: item.productId,
      title: item.title,
      image: item.image,
      price: Number(item.price),
      orderStatus: order.orderStatus,
      orderDate: new Date(order.orderDate),
    }))
  );

  // 2️⃣ Sắp xếp theo ngày mới nhất
  allProducts.sort((a, b) => b.orderDate - a.orderDate);

  // 3️⃣ Loại bỏ trùng lặp theo productId
  const uniqueProducts = Array.from(
    new Map(allProducts.map((p) => [p.productId, p])).values()
  );
  const recentProducts = uniqueProducts.slice(0, 5);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Sản phẩm",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar shape="square" size={48} src={record.image} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${parseInt(price).toLocaleString()} đ`,
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>📊 Thống kê tổng quan</Title>

      {/* --- Thống kê nhanh --- */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered hoverable>
            <Statistic
              title="Tổng sản phẩm"
              value={totalProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered hoverable>
            <Statistic
              title="Tổng đơn hàng"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered hoverable>
            <Statistic
              title="Tổng người dùng"
              value={totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered hoverable>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix="$"
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      {/* --- Biểu đồ --- */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <Title level={4}>📦 Thống kê trạng thái đơn hàng</Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#1890ff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-8">
        <RevenueChart data={revenueData} />
      </div>

      <div className="flex gap-5">
        <div className="flex flex-[3] w-full">
          <div className=" mt-8 w-full bg-white p-4 rounded-lg shadow">
            <Title level={4}>
              <ClockCircleOutlined /> 3 sản phẩm được mua gần nhất
            </Title>
            <Table
              dataSource={recentProducts}
              columns={columns}
              pagination={false}
              bordered
            />
          </div>
        </div>
        <div className="flex flex-[1]">
          <div className="w-full mt-8 bg-white p-4 rounded-lg shadow">
            <Title level={4}>
              <MessageOutlined /> Đánh giá gần nhất
            </Title>
            <List
              itemLayout="horizontal"
              dataSource={latestReviews}
              renderItem={(review) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: "#1890ff" }}
                        icon={<UserOutlined />}
                      />
                    }
                    title={
                      <div className="flex items-center justify-between w-full">
                        <span>{review.userName}</span>
                        <Rate
                          value={review.reviewValue}
                          disabled
                          style={{ fontSize: 14 }}
                        />
                      </div>
                    }
                    description={
                      <>
                        <div>{review.reviewMessage}</div>
                        <small style={{ color: "#999" }}>
                          {new Date(review.createdAt).toLocaleString("vi-VN")}
                        </small>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </div>

        {/* --- 3 sản phẩm được mua gần nhất --- */}
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <Title level={4}>Tạo Sales</Title>

        <SaleForm />
        <SaleList />
      </div>

      {/* --- Đánh giá gần nhất --- */}
    </div>
  );
}

export default AdminDashboard;
