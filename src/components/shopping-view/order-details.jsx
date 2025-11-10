import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);
  console.log(orderDetails);
  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Mã</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Hình ảnh</p>
            <div className="flex gap-3 grid-cols-3">
              {orderDetails &&
                orderDetails.cartItems.map((item) => {
                  return (
                    <img
                      key={item.productId}
                      src={item.image}
                      alt=""
                      className="w-[100px] h-full rounded-sm object-cover"
                    />
                  );
                })}
            </div>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Ngày đặt</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
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
            <p className="font-medium">Trạng thái đơn hàng</p>
            <Label>
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
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Chi tiết sản phẩm</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>Tên: {item?.title}</span>
                      <span>Dung lượng: {item?.capacity}</span>

                      <span>Số lượng: {item?.quantity}</span>
                      <span>Giá: ${item?.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Thông tin vận chuyển</div>
            <div className="grid grid-cols-2 text-muted-foreground">
              <span>Tên: {user.userName}</span>
              <span>Địa chỉ: {orderDetails?.addressInfo?.address}</span>
              <span>Thành phố: {orderDetails?.addressInfo?.city}</span>
              <span>Mã code: {orderDetails?.addressInfo?.pincode}</span>
              <span>Số điện thoại: {orderDetails?.addressInfo?.phone}</span>
              <span>Ghi chú: {orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
