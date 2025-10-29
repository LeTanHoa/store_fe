import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import oke from "./../../assets/oke.jpg";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-10 h-screen flex items-center justify-center flex-col">
      <img src={oke} alt="" className="w-full md:w-[50%] object-contain h-[30%] md:h-[50%]" />
      <CardHeader className="p-0">
        <CardTitle className="text-xl md:text-4xl">Đặt hàng thành công!</CardTitle>
      </CardHeader>
      <Button className="mt-5" onClick={() => navigate("/shop/account")}>
        Xem hóa đơn
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;
