import { useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Button,
  message,
} from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/store/admin/products-slice";

const { RangePicker } = DatePicker;

export default function SaleForm({ editId }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  const { productList } = useSelector((state) => state.adminProducts);
  const onFinish = async (values) => {
    const body = {
      name: values.name,
      products: values.products,
      discountPercent: values.discountPercent,
      startDate: values.date[0],
      endDate: values.date[1],
    };

    try {
      if (editId) {
        await axios.put(
          `http://localhost:8080/api/admin/sales/${editId}`,
          body
        );
        message.success("Cập nhật chương trình giảm giá thành công!");
      } else {
        const res = await axios.post(
          "http://localhost:8080/api/admin/sales",
          body
        );
        message.success(
          res.data.message || "Tạo chương trình giảm giá thành công!"
        );
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errMsg);
      console.error("❌ Lỗi khi tạo/cập nhật sale:", error);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item label="Sale Name" name="name" rules={[{ required: true }]}>
        <Input placeholder="Tên sự kiện sale..." />
      </Form.Item>

      <Form.Item label="Products" name="products" rules={[{ required: true }]}>
        <Select mode="multiple">
          {productList.map((p) => (
            <Select.Option key={p._id} value={p._id}>
              {p.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Discount (%)"
        name="discountPercent"
        rules={[{ required: true }]}
      >
        <InputNumber min={1} max={90} />
      </Form.Item>

      <Form.Item label="Sale Time" name="date" rules={[{ required: true }]}>
        <RangePicker showTime />
      </Form.Item>

      <Button htmlType="submit" type="primary">
        Lưu
      </Button>
    </Form>
  );
}
