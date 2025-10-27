import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getFeatureImages } from "@/store/common-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { toast } from "react-toastify";
const ShoppingHome = () => {
  const categoriesWithIcon = [
    {
      id: "smartphone",
      label: "Điện thoại",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/IP_Desk_25.png",
    },
    {
      id: "laptop",
      label: "Laptop",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Mac_Desk_25.png",
    },
    {
      id: "tablet",
      label: "Máy tính bảng",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Ipad_Desk_25.png",
    },
    {
      id: "headphone",
      label: "Tai nghe",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Speaker_Desk_25.png",
    },
    {
      id: "smartwatch",
      label: "Đồng hồ thông minh",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Watch_Desk.png",
    },
    {
      id: "accessories",
      label: "Phụ kiện",
      img: "https://cdnv2.tgdd.vn/webmwg/2024/tz/images/desktop/Phukien_Desk_25.png",
    },
  ];

  const brandsWithIcon = [
    {
      id: "apple",
      label: "Apple",
      img: "https://logo.com/image-cdn/images/kts928pd/production/4429bc095f6ddb190c0457f215d2d625959aae87-1600x900.png?w=1920&q=72&fm=webp",
    },
    {
      id: "samsung",
      label: "Samsung",
      img: "https://cdn.freebiesupply.com/logos/large/2x/samsung-1-logo-png-transparent.png",
    },
    {
      id: "xiaomi",
      label: "Xiaomi",
      img: "https://r.testifier.nl/Acbs8526SDKI/resizing_type:fill/width:1200/height:900/plain/https://s3-newsifier.ams3.digitaloceanspaces.com/gizchina.com/images/2025-06/250000058cbb4c7bae2d056eb8f5d1b5.jpg@webp",
    },
    {
      id: "oppo",
      label: "Oppo",
      img: "https://www.freelogovectors.net/wp-content/uploads/2023/09/oppo-logo-freelogovectors.net_.png",
    },
    {
      id: "asus",
      label: "Asus",
      img: "https://cdn.freebiesupply.com/logos/large/2x/asus-6630-logo-png-transparent.png",
    },
    {
      id: "dell",
      label: "Dell",
      img: " https://images.seeklogo.com/logo-png/19/2/dell-logo-png_seeklogo-199689.png",
    },
  ];

  const categories = [
    { id: "smartphone", label: "Điện thoại" },
    { id: "laptop", label: "Laptop" },
    { id: "tablet", label: "Máy tính bảng" },
    { id: "headphone", label: "Tai nghe" },
    { id: "smartwatch", label: "Đồng hồ thông minh" },
    { id: "accessories", label: "Phụ kiện" },
  ];

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

  const settingsBanner = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const { productList } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);

  const filteredImages = featureImageList?.filter(
    (item) => item?.type === (isMobile ? "mobile" : "desktop")
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

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
        toast.success("Sản phẩm đã được thêm vào giỏ hàng");
      }
    });
  }

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  const productsByCategory = Object.fromEntries(
    categories.map(({ id }) => [
      id,
      productList?.filter((product) => product.category === id) || [],
    ])
  );

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-full md:h-[450px]">
        <Slider {...settingsBanner}>
          {filteredImages && filteredImages.length > 0 ? (
            filteredImages.map((slide, index) => (
              <div key={index}>
                <img
                  src={slide?.image}
                  alt={`banner-${index}`}
                  className="w-full h-full md:h-[450px] object-cover"
                />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-[100px] md:h-[450px] bg-gray-100">
              <p className="text-gray-500">Không có banner phù hợp</p>
            </div>
          )}
        </Slider>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl uppercase font-bold text-center mb-8">
            Danh mục sản phẩm
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoriesWithIcon.map((categoryItem, index) => (
              <Card
                key={index}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img src={categoryItem.img} alt="" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center uppercase mb-8">
            Thương hiệu
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem, index) => (
              <Card
                key={index}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-between h-full p-6">
                  <img src={brandItem.img} alt="" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {categories.map(({ id, label }) => {
        const products = productsByCategory[id];
        return (
          <section key={id}>
            <div className="container py-10 mx-auto px-4">
              <h2 className="text-3xl uppercase font-bold text-center mb-8">
                {label}
              </h2>
              {products.length === 0 ? (
                <p className="text-center">Chưa có sản phẩm nào</p>
              ) : (
                <div className="h-auto w-full">
                  <Slider {...settings}>
                    {products.map((productItem) => (
                      <ShoppingProductTile
                        key={productItem._id}
                        handleGetProductDetails={handleGetProductDetails}
                        product={productItem}
                        handleAddtoCart={handleAddtoCart}
                      />
                    ))}
                  </Slider>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ShoppingHome;
