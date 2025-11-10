import { useState } from "react";
import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder, capturePayment } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getOrderDetailsForAdmin } from "@/store/admin/order-slice";
import { toast } from "react-toastify";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);

  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  async function handleInitiatePayment() {
    if (isProcessing) return;
    if (!cartItems?.items?.length) {
      toast.success("Giỏ hàng của bạn đang trống");
      return;
    }
    if (!currentSelectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    setIsProcessing(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
        capacity: item?.capacity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      paymentMethod,
      totalAmount: totalCartAmount,
    };

    try {
      const res = await dispatch(createNewOrder(orderData)).unwrap();
      console.log(res);
      // Expect res to be response.data from backend
      if (res?.approvalURL) {
        // PayPal: store orderId locally so we can capture later
        if (res?.orderId) {
          sessionStorage.setItem("pendingOrderId", res.orderId);
        }
        window.location.href = res.approvalURL;
      } else if (res?.success) {
        // COD flow
        toast.success("Đặt hàng thành công");
        const orderRes = await dispatch(
          getOrderDetailsForAdmin(res?.orderId)
        ).unwrap();
        console.log(orderRes);
        await axios.post(
          "http://localhost:8080/api/email/send-mail-order-success",
          {
            email: user?.email,
            data: orderRes,
          }
        );
        navigate("/shop/payment-success");
      } else {
        toast("Đặt hàng thất bại, vui lòng thử lại sau");
      }
    } catch (err) {
      console.log(err);
      toast.error("Đã xảy ra lỗi trong quá trình đặt hàng");
    } finally {
      setIsProcessing(false);
    }
  }

  // Frontend route for PayPal return should call capturePayment with query params
  // Example (not included here): on PayPal return page, call:
  // dispatch(capturePayment({ paymentId, payerId, orderId: sessionStorage.getItem('pendingOrderId') }))

  return (
    <div className="flex flex-col">
      <span className="text-center mt-10 uppercase font-bold text-[25px] h-full block w-full">
        Giỏ hàng
      </span>

      <div className="grid grid-cols-1  sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        <div className="flex flex-col gap-4">
          {cartItems?.items?.map((item) => (
            <UserCartItemsContent key={item.productId} cartItem={item} />
          ))}

          <div className="mt-6 space-y-2">
            <h2 className="font-bold text-lg">Phương thức thanh toán</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                />
                PayPal
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Thanh toán khi nhận hàng (COD)
              </label>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Tổng cộng</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>

          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiatePayment}
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Thanh toán"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
