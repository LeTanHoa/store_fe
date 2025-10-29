import CommonForm from "@/components/common/form";
// import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(values) {
    dispatch(loginUser(values)).then(async (data) => {
      if (data?.payload?.success) {
        toast.success("Đăng nhập thành công!");

        try {
          await axios.post("http://localhost:8080/api/email/send-mail-login", {
            email: data?.payload?.user?.email,
            name: data?.payload?.user?.userName,
          });
        } catch (error) {
          console.error("Lỗi gửi mail:", error);
          toast.warning(
            "Đăng ký thành công, nhưng chưa gửi được email thông báo."
          );
        }
      } else {
        toast.error({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Đăng nhập
        </h1>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Đăng nhập"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <p className="">
        Bạn chưa có tài khoản?
        <Link
          className="font-medium ml-2 text-primary hover:underline"
          to="/auth/register"
        >
          Đăng ký
        </Link>
      </p>
    </div>
  );
}

export default AuthLogin;
