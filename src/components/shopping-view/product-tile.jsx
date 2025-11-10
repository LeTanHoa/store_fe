import { Card, CardContent } from "../ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
const ShoppingProductTile = ({
  product,
  // handleGetProductDetails,
}) => {
  const imageUrl =
    product?.images?.[0] ||
    product?.image ||
    "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <Card className="w-[95%] mx-auto">
      <div className="relative pt-8">
        <img
          src={imageUrl}
          alt={product?.title}
          className="w-full h-[300px] object-contain rounded-t-lg"
        />
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            Hết hàng
          </Badge>
        ) : product?.totalStock < 10 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            {`Chỉ còn ${product?.totalStock} sản phẩm`}
          </Badge>
        ) : null}
      </div>
      <CardContent className="p-4">
        {/* <div onClick={() => handleGetProductDetails(product?._id)}> */}
        <Link to={`/shop/product/${product?._id}`}>
          <h2 className="text-xl cursor-pointer font-bold mb-2">
            {product?.title}
          </h2>
        </Link>
        {/* </div> */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[16px] text-muted-foreground">
            {categoryOptionsMap[product?.category]}
          </span>
          <span className="text-[16px] text-muted-foreground">
            {brandOptionsMap[product?.brand]}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              product?.salePrice > 0 ? "line-through" : ""
            } text-lg font-semibold text-primary`}
          >
            ${product?.price}
          </span>
          {product?.salePrice > 0 ? (
            <span className="text-lg font-semibold text-primary">
              ${product?.salePrice}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoppingProductTile;
