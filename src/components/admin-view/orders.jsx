import { useEffect, useState } from "react";
import { Button, Table, Tag, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
  deleteOrderById,
} from "@/store/admin/order-slice";
import AdminOrderDetailsView from "./order-details";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { orderList, orderDetails, isLoading } = useSelector(
    (state) => state.adminOrder
  );

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  function handleFetchOrderDetails(id) {
    dispatch(getOrderDetailsForAdmin(id)).then(() => {
      setOpenDetailsDialog(true);
    });
  }

  function handleDeleteOrder(orderId) {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa đơn hàng này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        dispatch(deleteOrderById(orderId))
          .unwrap()
          .then(() => message.success("Xóa đơn hàng thành công"))
          .catch(() => message.error("Không thể xóa đơn hàng"));
      },
    });
  }

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => text?.split("T")[0],
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        let color =
          status === "confirmed"
            ? "green"
            : status === "rejected"
            ? "red"
            : "gray";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `$${amount}`,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => handleFetchOrderDetails(record._id)}
          >
            Xem chi tiết
          </Button>
          <Button danger onClick={() => handleDeleteOrder(record._id)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Tất cả đơn hàng</h2>

      <Table
        columns={columns}
        dataSource={orderList}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết đơn hàng"
        open={openDetailsDialog}
        onCancel={() => {
          setOpenDetailsDialog(false);
          dispatch(resetOrderDetails());
        }}
        footer={null}
        width={800}
        getContainer={false} //
      >
        <AdminOrderDetailsView
          cancel={() => setOpenDetailsDialog(false)}
          orderDetails={orderDetails}
        />
      </Modal>
    </div>
  );
}

export default AdminOrdersView;
