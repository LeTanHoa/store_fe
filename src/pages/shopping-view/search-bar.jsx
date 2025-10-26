import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { toast } from "react-toastify";

function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 để biết đang ở trang nào
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading } = useSelector((state) => state.shopSearch);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmed = keyword.trim();

      if (trimmed.length > 3) {
        const query = `?keyword=${trimmed}`;

        // 👇 Nếu chưa ở trang search → điều hướng sang đó
        if (!location.pathname.includes("/shop/search")) {
          navigate(`/shop/search${query}`);
        } else {
          // 👇 Nếu đã ở trang search → chỉ cập nhật query
          setSearchParams(new URLSearchParams(query));
          dispatch(getSearchResults(trimmed));
        }
      } else {
        dispatch(resetSearchResults());
      }
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [keyword, location.pathname]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (keyword.trim().length > 3) {
      navigate(`/shop/search?keyword=${keyword}`);
    } else {
      toast.warning("Vui lòng nhập từ khóa tìm kiếm dài hơn 3 ký tự");
    }
  }

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full md:w-[25%] ">
      <Input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="🔍 Nhập sản phẩm..."
        className="pl-3 pr-10 py-5 text-sm"
      />
      {isLoading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
          Đang tìm...
        </span>
      )}
    </form>
  );
}

export default SearchBar;
