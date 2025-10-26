import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderDetailsForAdmin } from "@/store/admin/order-slice";
import { capturePayment } from "@/store/shop/order-slice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  useEffect(() => {
    const handlePayment = async () => {
      if (paymentId && payerId) {
        const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
        if (!orderId) return;

        try {
          const result = await dispatch(
            capturePayment({ paymentId, payerId, orderId })
          ).unwrap();

          if (result?.success) {
            console.log("Thanh toán PayPal thành công:", orderId);

            const orderRes = await dispatch(
              getOrderDetailsForAdmin(orderId)
            ).unwrap();
            console.log(orderRes);
            await axios.post(
              "http://localhost:8080/api/email/send-mail-order-success",
              {
                email: user?.email,
                data: orderRes,
              }
            );

            sessionStorage.removeItem("currentOrderId");
            window.location.href = "/shop/payment-success";
          }
        } catch (error) {
          console.error("Lỗi xác nhận PayPal:", error);
        }
      }
    };

    handlePayment();
  }, [paymentId, payerId, dispatch]);

  return (
    <div className="min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Đang xử lý thanh toán...Vui lòng đợi!</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export default PaypalReturnPage;
