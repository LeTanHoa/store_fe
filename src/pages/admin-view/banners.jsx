import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileIcon, UploadCloudIcon, XIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import axios from "axios";
import { Select, message } from "antd";

function AdminBanners() {
  const [imageFile, setImageFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [bannerType, setBannerType] = useState("");
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { featureImageList, isLoading } = useSelector(
    (state) => state.commonFeature
  );

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleRemoveSelectedImage = () => {
    setImageFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUploadFeatureImage = async () => {
    if (!imageFile) return message.warning("Vui lòng chọn ảnh!");
    if (!bannerType) return message.warning("Vui lòng chọn loại banner!");

    setImageLoading(true);
    try {
      await dispatch(addFeatureImage({ imageFile, type: bannerType }));
      dispatch(getFeatureImages());
      message.success("Tải banner thành công!");
      handleRemoveSelectedImage();
      setBannerType("");
    } catch (error) {
      message.error("Không thể upload ảnh!");
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteFeatureImage = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá ảnh này không?")) return;
    await axios.delete(`http://localhost:8080/api/common/feature/delete/${id}`);
    dispatch(getFeatureImages());
    message.success("Đã xóa banner!");
  };

  return (
    <div className="w-full mt-4 max-w-2xl mx-auto">
      <Label className="text-lg font-semibold mb-2 block">Thêm Banner</Label>
      <div className="flex flex-col gap-4">
        <Select
          value={bannerType}
          onChange={(value) => setBannerType(value)}
          placeholder="Chọn loại banner"
          style={{ width: 200 }}
        >
          <Select.Option value="mobile">Mobile</Select.Option>
          <Select.Option value="desktop">Desktop</Select.Option>
        </Select>
        {/* Upload box */}
        <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center gap-3">
          <Input
            id="image-upload"
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={handleImageChange}
          />

          {!imageFile ? (
            <div className="flex flex-col gap-3 items-center">
              <Label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadCloudIcon className="w-10 h-10 text-gray-500 mb-2" />
                <p>Kéo thả hoặc click để chọn ảnh</p>
              </Label>
            </div>
          ) : imageLoading ? (
            <Skeleton className="h-10 bg-gray-100 w-full" />
          ) : (
            <div className="flex items-center justify-between w-full border rounded-md p-2">
              <div className="flex items-center gap-2">
                <FileIcon className="w-5 h-5 text-primary" />
                <p className="text-sm truncate max-w-[150px]">
                  {imageFile.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveSelectedImage}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={!imageFile || imageLoading}
      >
        {imageLoading ? "Đang upload..." : "Upload"}
      </Button>

      {/* Danh sách ảnh */}
      <div className="flex flex-col gap-4 mt-6">
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : featureImageList?.length > 0 ? (
          featureImageList.map((item) => (
            <div key={item._id} className="relative">
              <img
                src={item.image}
                alt="banner"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute top-3 left-3 bg-black/50 text-white px-3 py-1 rounded-md text-xs">
                {item.type?.toUpperCase()}
              </div>
              <Button
                onClick={() => handleDeleteFeatureImage(item._id)}
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 rounded-full bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Chưa có ảnh nào</p>
        )}
      </div>
    </div>
  );
}

export default AdminBanners;
