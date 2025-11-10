import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Rate, Input, Button, Avatar, Divider } from "antd";
import Slider from "react-slick";

import { UserOutlined, LeftOutlined } from "@ant-design/icons";
import {
  fetchProductDetails,
  setProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { addReview, getReviews } from "@/store/shop/review-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { toast } from "react-toastify";

const { TextArea } = Input;

function ProductDetail() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: isMobile ? 1 : 4,
  };
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const [rating, setRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const { productList } = useSelector((state) => state.shopProducts);

  useEffect(() => {
    if (id) dispatch(fetchProductDetails(id));
    return () => dispatch(setProductDetails());
  }, [id]);

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
      setMainImage(productDetails?.images?.[0]);
    }
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
      : productDetails?.averageReview || 0;

  const handleAddToCart = () => {
    if (!selectedCapacity && productDetails.capacities?.length > 0) {
      toast.error("Vui lòng chọn dung lượng trước khi thêm vào giỏ hàng!");
      return;
    }

    const currentItems = cartItems.items || [];
    const existing = currentItems.find(
      (item) =>
        item.productId === productDetails?._id &&
        item.capacity === selectedCapacity // ✅ kiểm tra theo dung lượng
    );

    if (existing && existing.quantity + 1 > productDetails.totalStock) {
      toast.error(
        `Chỉ có thể thêm tối đa ${productDetails.totalStock} sản phẩm này`
      );
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: productDetails._id,
        capacity: selectedCapacity,
        quantity: 1,
      })
    ).then((res) => {
      if (res.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Đã thêm vào giỏ hàng!");
      }
    });
  };

  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((res) => {
      if (res.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails._id));
        toast.success("Đã gửi đánh giá!");
      } else {
        toast.error("Đánh giá thất bại. Vui lòng thử lại.");
      }
    });
  };

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  const filteredProducts = productList?.filter(
    (item) =>
      item.category === productDetails?.category &&
      item._id !== productDetails?._id
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productDetails]);

  if (!productDetails) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 text-lg">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-center mb-5 gap-4">
        <LeftOutlined onClick={() => window.history.back()} />
        <h1 className=" text-2xl md:text-3xl font-bold ">
          {productDetails?.title}
        </h1>
      </div>
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="relative p-14 border rounded-2xl overflow-hidden group">
            <img
              src={mainImage}
              alt={productDetails?.title}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <div className="flex gap-3 mt-4 justify-center">
            {productDetails?.images?.map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImage(img)}
                className={`cursor-pointer border-2 rounded-xl overflow-hidden w-20 h-20 ${
                  mainImage === img ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <img
                  src={img}
                  alt={`thumb-${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-3">{productDetails?.title}</h1>
          <p className="text-gray-500 mb-4">{productDetails?.description}</p>
          <div className="flex items-center mb-4">
            <Rate allowHalf value={averageReview} disabled />
            <span className="ml-2 text-gray-500">
              ({averageReview.toFixed(1)})
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span
              className={`text-3xl font-semibold ${
                productDetails?.salePrice > 0
                  ? "line-through text-gray-400"
                  : "text-primary"
              }`}
            >
              ${productDetails?.price}
            </span>
            {productDetails?.salePrice > 0 && (
              <span className="text-3xl font-bold text-red-500">
                ${productDetails?.salePrice}
              </span>
            )}
          </div>{" "}
          <p className="mb-3 text-gray-600">
            Dung lượng:{" "}
            <span className="font-medium">
              {productDetails?.capacities &&
              productDetails?.capacities.length > 0
                ? productDetails.capacities.map((cap, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCapacity(cap)}
                      className={`mr-2 px-3 py-1 rounded-xl border transition 
            ${
              selectedCapacity === cap
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
                    >
                      {cap}
                    </button>
                  ))
                : "Không hỗ trợ"}
            </span>
          </p>
          <p className="mb-3 text-gray-600">
            Danh mục:{" "}
            <span className="font-medium">{productDetails?.category}</span>
          </p>
          <p className="mb-3 text-gray-600">
            Thương hiệu:{" "}
            <span className="font-medium">{productDetails?.brand}</span>
          </p>
          <p className="mb-6 text-gray-600">
            Tồn kho:{" "}
            <span className="font-medium">{productDetails?.totalStock}</span>
          </p>
          {productDetails?.totalStock > 0 ? (
            <Button
              type="primary"
              className="!rounded-xl w-full h-12 text-lg"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </Button>
          ) : (
            <Button
              disabled
              className="!rounded-xl w-full h-12 text-lg opacity-70"
            >
              Hết hàng
            </Button>
          )}
        </div>

        <div className="lg:col-span-2 mt-12">
          <Divider>Đánh giá sản phẩm</Divider>

          <div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto">
            {reviews && reviews.length > 0 ? (
              reviews.map((r, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Avatar size="large" icon={<UserOutlined />} />
                  <div>
                    <h4 className="font-semibold">{r.userName}</h4>
                    <Rate disabled value={r.reviewValue} />
                    <p className="text-gray-600 mt-1">{r.reviewMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Chưa có đánh giá nào.</p>
            )}
          </div>

          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-semibold mb-3">
              Viết đánh giá của bạn
            </h3>
            <Rate value={rating} onChange={(val) => setRating(val)} />
            <TextArea
              rows={3}
              className="mt-3"
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              placeholder="Nhập nhận xét của bạn..."
            />
            <Button
              type="primary"
              className="mt-3 !rounded-xl"
              onClick={handleAddReview}
              disabled={!reviewMsg.trim()}
            >
              Gửi đánh giá
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2 mt-12">
          <Divider>Sản phẩm tương tự</Divider>
          <Slider {...settings}>
            {filteredProducts && filteredProducts.length > 0
              ? filteredProducts
                  .slice(0, 8)
                  .map((productItem) => (
                    <ShoppingProductTile
                      key={productItem._id}
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddToCart}
                    />
                  ))
              : "Không có sản phẩm tương tự nào."}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
