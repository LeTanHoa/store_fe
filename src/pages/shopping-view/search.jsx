import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "react-toastify";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { searchResults, isLoading, error } = useSelector(
    (state) => state.shopSearch
  );
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  // 🟩 Khi user truy cập vào /shop/search?keyword=... => tự động load
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword") || "";
    setKeyword(urlKeyword);
    if (urlKeyword.trim().length > 3) {
      dispatch(getSearchResults(urlKeyword));
    } else {
      dispatch(resetSearchResults());
    }
  }, [searchParams]);

  // 🟩 Khi nhập keyword thủ công ở trang này
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (keyword.trim().length > 3) {
        dispatch(getSearchResults(keyword));
      } else {
        dispatch(resetSearchResults());
      }
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.success(
            "Chỉ có thể thêm tối đa " + getTotalStock + " sản phẩm này"
          );
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Đã thêm sản phẩm vào giỏ ✅" });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className=" min-h-screen container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="🔍 Nhập tên sản phẩm (ít nhất 4 ký tự)..."
          />
        </div>
      </div>

      {isLoading && <p className="text-lg text-gray-500">Đang tìm kiếm...</p>}
      {error && (
        <p className="text-red-600 font-medium">Lỗi tìm kiếm: {error}</p>
      )}
      {!isLoading &&
        !error &&
        !searchResults?.length &&
        keyword.trim().length > 3 && (
          <h1 className="text-2xl font-extrabold">Không tìm thấy sản phẩm!</h1>
        )}

      {!isLoading && searchResults.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">
            🔎 Tìm thấy {searchResults.length} sản phẩm
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {searchResults.map((item) => (
              <ShoppingProductTile
                key={item._id}
                handleAddtoCart={handleAddtoCart}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchProducts;
