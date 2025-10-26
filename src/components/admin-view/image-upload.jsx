import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFiles,
  setImageFiles,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  // Xử lý chọn file
  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...selectedFiles]);
    }
  }

  // Drag & Drop
  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    if (droppedFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...droppedFiles]);
    }
  }

  // Xoá file
  function handleRemoveImage(index) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadedImageUrl((prev) => prev.filter((_, i) => i !== index));
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  // Upload nhiều ảnh
  async function uploadImagesToCloudinary() {
    setImageLoadingState(true);

    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const data = new FormData();
        data.append("my_files", file);

        const response = await axios.post(
          "https://storebe-api.vercel.app/api/admin/products/upload-images",
          data
        );

        console.log("Upload response:", response.data);

        const urls = Array.isArray(response?.data?.images)
          ? response.data.images
          : [response?.data?.images];

        return urls[0];
      });

      const urls = await Promise.all(uploadPromises);

      console.log("Final URLs:", urls);

      setUploadedImageUrl((prev) => [...(prev || []), ...urls]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  // Khi có file thì tự upload
  useEffect(() => {
    if (imageFiles?.length > 0) {
      uploadImagesToCloudinary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFiles]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Thêm hình ảnh</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 ${
          isEditMode ? "bg-gray-100" : ""
        }`}
      >
        {/* Input hidden */}
        <Input
          id="image-upload"
          type="file"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {/* Chưa có file */}
        {imageFiles?.length === 0 ? (
          <Label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center h-32 cursor-pointer text-gray-700 ${
              isEditMode ? "cursor-not-allowed" : ""
            }`}
          >
            <UploadCloudIcon className="w-10 h-10 text-gray-500 mb-2" />
            <span className="text-gray-700">
              Drag & drop or click to upload images
            </span>
          </Label>
        ) : imageLoadingState ? (
          <div>
            <Skeleton className="h-10 bg-gray-100"  />
            <span>Đang tải...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {Array.isArray(uploadedImageUrl) &&
              uploadedImageUrl.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-md p-2"
                >
                  <div className="flex items-center gap-2">
                    <FileIcon className="w-6 h-6 text-primary" />
                    <p className="text-sm font-medium truncate max-w-[150px]">
                      {imageFiles[index]?.name || "Uploaded Image"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={url}
                      alt="preview"
                      className="w-10 h-10 object-cover rounded"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <XIcon className="w-4 h-4" />
                      <span className="sr-only">Remove File</span>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
