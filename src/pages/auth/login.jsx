import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Form, Input, Button, message } from "antd";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [emailForgot, setEmailForgot] = useState("");
  const [loading, setLoading] = useState(false);

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
            "Đăng nhập thành công, nhưng chưa gửi được email thông báo."
          );
        }
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  const handleSendOTP = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email: values.email,
      });
      message.success("Đã gửi mã OTP đến email của bạn!");
      setEmailForgot(values.email);
      setIsForgotModalOpen(false);
      setIsResetModalOpen(true);
    } catch (err) {
      message.error(err?.response?.data?.message || "Không thể gửi OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/reset-password", {
        email: emailForgot,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      message.success("Đặt lại mật khẩu thành công!");
      setIsResetModalOpen(false);
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Lỗi khi đặt lại mật khẩu!"
      );
    } finally {
      setLoading(false);
    }
  };

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

      <div className="flex justify-between items-center">
        <p>
          Bạn chưa có tài khoản?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Đăng ký
          </Link>
        </p>
        <Button type="link" onClick={() => setIsForgotModalOpen(true)}>
          Quên mật khẩu?
        </Button>
      </div>

      {/* MODAL GỬI OTP */}
      <Modal
        title="Quên mật khẩu"
        open={isForgotModalOpen}
        onCancel={() => setIsForgotModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSendOTP}>
          <Form.Item
            label="Nhập email của bạn"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Gửi mã OTP
          </Button>
        </Form>
      </Modal>

      {/* MODAL RESET MẬT KHẨU */}
      <Modal
        title="Đặt lại mật khẩu"
        open={isResetModalOpen}
        onCancel={() => setIsResetModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleResetPassword}>
          <Form.Item
            label="Mã OTP"
            name="otp"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
          >
            <Input placeholder="Nhập mã OTP" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Xác nhận đổi mật khẩu
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default AuthLogin;
