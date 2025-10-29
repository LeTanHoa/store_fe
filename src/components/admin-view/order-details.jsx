import { useState } from "react";
import CommonForm from "../common/form";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import axios from "axios";
import { toast } from "react-toastify";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ cancel, orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  function handleUpdateStatus(values) {
    const { status } = values;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then(async (data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        cancel();

        try {
          await axios.post(
            "http://localhost:8080/api/email/send-mail-order-status",
            {
              idUser: orderDetails?.userId,
              orderStatus: status,
              data: orderDetails,
            }
          );
        } catch (error) {
          console.log(error);
        }

        toast.success(data?.payload?.message);
      }
    });
  }

  if (!orderDetails) return null;
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <div className="flex mt-4 items-center justify-between">
          <p className="font-medium">Mã</p>
          <Label>{orderDetails?._id}</Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className="font-medium">Ngày đặt</p>
          <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className="font-medium">Giá</p>
          <Label>${orderDetails?.totalAmount}</Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className="font-medium">Hình thức thanh toán</p>
          <Label>{orderDetails?.paymentMethod}</Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className="font-medium">Trạng thái thanh toán</p>
          <Label>{orderDetails?.paymentStatus}</Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className="font-medium">Trạng thái đặt hàng</p>
          <Badge
            className={`py-1 px-3 ${
              orderDetails?.orderStatus === "confirmed"
                ? "bg-green-500"
                : orderDetails?.orderStatus === "rejected"
                ? "bg-red-600"
                : "bg-black"
            }`}
          >
            {orderDetails?.orderStatus}
          </Badge>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <div className="font-medium">Chi tiết đặt hàng</div>
        <ul className="grid gap-3">
          {orderDetails?.cartItems?.length > 0 &&
            orderDetails.cartItems.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>Tên: {item.title}</span>
                <span>Số lượng: {item.quantity}</span>
                <span>Giá: ${item.price}</span>
              </li>
            ))}
        </ul>
      </div>

      <Separator />

      <div className="grid gap-4">
        <div className="font-medium">Thông tin vận chuyển</div>
        <div className="grid grid-cols-2 text-muted-foreground">
          <span>{user?.userName}</span>
          <span>{orderDetails?.addressInfo?.address}</span>
          <span>{orderDetails?.addressInfo?.city}</span>
          <span>{orderDetails?.addressInfo?.pincode}</span>
          <span>{orderDetails?.addressInfo?.phone}</span>
          <span>{orderDetails?.addressInfo?.notes}</span>
        </div>
      </div>

      <CommonForm
        formControls={[
          {
            label: "Trạng thái đơn hàng",
            name: "status",
            componentType: "select",
            options: [
              { id: "pending", label: "Đang chờ" },
              { id: "inProcess", label: "Đang xử lý" },
              { id: "inShipping", label: "Đang vận chuyển" },
              { id: "delivered", label: "Đã giao hàng" },
              { id: "rejected", label: "Hủy" },
            ],
          },
        ]}
        formData={formData}
        setFormData={setFormData}
        buttonText={"Cập nhật trạng thái đơn hàng"}
        onSubmit={handleUpdateStatus}
      />
    </div>
  );
}

export default AdminOrderDetailsView;
