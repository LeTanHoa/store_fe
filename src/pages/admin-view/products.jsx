import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Select, InputNumber, Button as AntButton } from "antd";
import { Button } from "@/components/ui/button";
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTable from "@/components/admin-view/product-table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;

const initialFormData = {
  images: [],
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // ✅ Khi formData thay đổi -> cập nhật form
  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  // ✅ Thêm hoặc sửa sản phẩm
  const onSubmit = (values) => {
    const payload = { ...values, images: uploadedImageUrl };

    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formData: payload })).then(
        (data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            resetForm();
            toast.success("Cập nhật sản phẩm thành công");
          }
        }
      );
    } else {
      dispatch(addNewProduct(payload)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          resetForm();
          toast.success("Thêm sản phẩm thành công");
        }
      });
    }
  };

  // ✅ Xóa sản phẩm
  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success("Xóa sản phẩm thành công");
      }
    });
  };

  // ✅ Reset form
  const resetForm = () => {
    form.resetFields();
    setFormData(initialFormData);
    setImageFiles([]);
    setUploadedImageUrl([]);
    setCurrentEditedId(null);
    setOpenCreateProductsDialog(false);
  };

  return (
    <Fragment>
      <div className="mb-5 w-full flex items-center justify-between">
        <span className="font-bold text-lg">Danh sách sản phẩm</span>
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Thêm sản phẩm mới
        </Button>
      </div>

      <div className="mt-4">
        {productList && productList.length > 0 ? (
          <AdminProductTable
            products={productList}
            setFormData={setFormData}
            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
            setCurrentEditedId={setCurrentEditedId}
            handleDelete={handleDelete}
          />
        ) : (
          <p>Không có sản phẩm nào</p>
        )}
      </div>

      {/* --- Drawer (Sheet) chứa form thêm/sửa --- */}
      <Sheet open={openCreateProductsDialog} onOpenChange={resetForm}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null
                ? "Chỉnh sửa sản phẩm"
                : "Thêm sản phẩm mới"}
            </SheetTitle>
          </SheetHeader>

          {/* Upload hình ảnh */}
          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          {/* Form sản phẩm */}
          <div className="py-6">
            <Form
              layout="vertical"
              form={form}
              initialValues={formData}
              onFinish={onSubmit}
              onValuesChange={(changed, all) => setFormData(all)}
            >
              <Form.Item
                label="Tên sản phẩm"
                name="title"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                ]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
              </Form.Item>

              <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  <Option value="smartphone">Điện thoại</Option>
                  <Option value="laptop">Laptop</Option>
                  <Option value="tablet">Máy tính bảng</Option>
                  <Option value="headphone">Tai nghe</Option>
                  <Option value="smartwatch">Đồng hồ thông minh</Option>
                  <Option value="accessories">Phụ kiện</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Thương hiệu"
                name="brand"
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu!" },
                ]}
              >
                <Select
                  placeholder="Chọn thương hiệu"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  <Option value="apple">Apple</Option>
                  <Option value="samsung">Samsung</Option>
                  <Option value="xiaomi">Xiaomi</Option>
                  <Option value="oppo">Oppo</Option>
                  <Option value="asus">Asus</Option>
                  <Option value="dell">Dell</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Giá"
                name="price"
                rules={[
                  { required: true, message: "Vui lòng nhập giá sản phẩm!" },
                ]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Nhập giá sản phẩm"
                />
              </Form.Item>

              <Form.Item label="Giá khuyến mãi" name="salePrice">
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Nhập giá khuyến mãi (nếu có)"
                />
              </Form.Item>

              <Form.Item
                label="Số lượng tồn kho"
                name="totalStock"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng tồn!" },
                ]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Nhập tổng số lượng tồn kho"
                />
              </Form.Item>

              <Form.Item>
                <AntButton type="primary" htmlType="submit" block>
                  {currentEditedId !== null ? "Cập nhật" : "Thêm sản phẩm"}
                </AntButton>
              </Form.Item>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
