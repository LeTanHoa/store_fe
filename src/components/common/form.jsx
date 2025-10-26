import { Form, Input, Select, Button } from "antd";
import { useEffect } from "react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const [form] = Form.useForm();

  // ✅ Cập nhật lại giá trị form khi formData thay đổi
  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  const handleValuesChange = (changedValues, allValues) => {
    setFormData(allValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={formData}
      onValuesChange={handleValuesChange}
      onFinish={onSubmit}
      className="mt-4"
    >
      {formControls.map((controlItem) => {
        switch (controlItem.componentType) {
          case "input":
            return (
              <Form.Item
                key={controlItem.name}
                name={controlItem.name}
                label={controlItem.label}
              >
                <Input
                  placeholder={controlItem.placeholder || ""}
                  type={controlItem.type || "text"}
                />
              </Form.Item>
            );

          case "select":
            return (
              <Form.Item
                key={controlItem.name}
                name={controlItem.name}
                label={controlItem.label}
              >
                <Select
                  placeholder={controlItem.placeholder || "Chọn"}
                  allowClear
                >
                  {controlItem.options?.map((opt) => (
                    <Select.Option key={opt.id} value={opt.id}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            );

          case "textarea":
            return (
              <Form.Item
                key={controlItem.name}
                name={controlItem.name}
                label={controlItem.label}
              >
                <Input.TextArea
                  rows={4}
                  placeholder={controlItem.placeholder || ""}
                />
              </Form.Item>
            );

          default:
            return (
              <Form.Item
                key={controlItem.name}
                name={controlItem.name}
                label={controlItem.label}
              >
                <Input
                  placeholder={controlItem.placeholder || ""}
                  type={controlItem.type || "text"}
                />
              </Form.Item>
            );
        }
      })}

      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={isBtnDisabled} block>
          {buttonText || "Submit"}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CommonForm;
