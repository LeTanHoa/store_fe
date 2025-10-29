import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState } from "react";

function ProductImageUpload({
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
}) {
  const [fileList, setFileList] = useState(
    uploadedImageUrl.map((url, i) => ({
      uid: i.toString(),
      name: `image-${i}`,
      status: "done",
      url,
    }))
  );

  const handleChange = async ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
    if (file.status === "uploading") setImageLoadingState(true);

    if (file.status === "done") {
      setImageLoadingState(false);
      const urls = newFileList
        .filter((f) => f.status === "done" && f.response)
        .map((f) => f.response.url);

      setUploadedImageUrl(urls);
      message.success(`${file.name} tải lên thành công`);
    } else if (file.status === "error") {
      setImageLoadingState(false);
      message.error(`${file.name} tải lên thất bại`);
    }
  };

  const handleRemove = (file) => {
    const updated = uploadedImageUrl.filter((url) => url !== file.url);
    setUploadedImageUrl(updated);
  };

  const customUpload = async ({ file, onSuccess, onError }) => {
    try {
      const data = new FormData();
      data.append("my_files", file);

      const res = await axios.post(
        "http://localhost:8080/api/admin/products/upload-images",
        data
      );

      const uploadedUrl = Array.isArray(res.data.images)
        ? res.data.images[0]
        : res.data.images;

      onSuccess({ url: uploadedUrl });
    } catch (err) {
      onError(err);
    }
  };

  return (
    <div>
      <p className="font-semibold mb-2">Hình ảnh sản phẩm</p>

      <Upload
        multiple
        listType="picture-card"
        fileList={fileList}
        customRequest={customUpload}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        {fileList.length >= 8 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
          </div>
        )}
      </Upload>
    </div>
  );
}

export default ProductImageUpload;
