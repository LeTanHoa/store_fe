import Slider from "react-slick";
import { useEffect, useState } from "react";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "react-toastify";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import ShoppingProductTile from "./product-tile";

export default function SaleProducts({ saleData }) {
  console.log(saleData);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // 768px là breakpoint cho mobile
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
    // responsive: [
    //   {
    //     breakpoint: 1024, // Tablet & small laptop
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 2,
    //       infinite: true,
    //       dots: true,
    //     },
    //   },
    //   {
    //     breakpoint: 768, // Mobile
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //       infinite: true,
    //       dots: true,
    //     },
    //   },
    // ],
  };

  const { user } = useSelector((state) => state.auth);

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Sản phẩm đã được thêm vào SalePr");
      }
    });
  }

  return (
    <div className="container py-10 mx-auto px-4">
      <section>
        <div className="container py-10 mx-auto px-4">
          <h2 className="text-3xl uppercase font-bold text-center mb-8">
            {saleData[0]?.name} – Giảm {saleData[0]?.discountPercent}% - Từ{" "}
            {saleData[0]?.startDate.slice(0, 10)} {""} tới {""}
            {saleData[0]?.endDate.slice(0, 10)}
          </h2>
          {
            <div className="h-auto w-full">
              <Slider {...settings}>
                {saleData[0]?.products?.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))}
              </Slider>
            </div>
          }
        </div>
      </section>
    </div>
  );
}
