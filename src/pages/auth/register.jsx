import CommonForm from "@/components/common/form";
// import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { toast } = useToast();

  function onSubmit(values) {
    dispatch(registerUser(values)).then(async (data) => {
      if (data?.payload?.success) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");

        try {
          await axios.post(
            "https://storebe-api.vercel.app/api/email/send-mail-register",
            {
              email: data?.meta?.arg?.email,
              name: data?.meta?.arg?.userName,
            }
          );
        } catch (error) {
          console.error("Lỗi gửi mail:", error);
          toast.warning(
            "Đăng ký thành công, nhưng chưa gửi được email thông báo."
          );
        }

        navigate("/auth/login");
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Đăng ký
        </h1>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Đăng ký"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <p className="">
        Bạn có tài khoản
        <Link
          className="font-medium ml-2 text-primary hover:underline"
          to="/auth/login"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}

export default AuthRegister;
