import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
const ShoppingProductTileListing = ({
  product,
  // handleGetProductDetails,
  handleAddtoCart,
}) => {
  const imageUrl =
    product?.images?.[0] ||
    product?.image ||
    "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <Card className="w-[95%] mx-auto">
      <div className="relative pt-8 px-2">
        <img
          src={imageUrl}
          alt={product?.title}
          className="w-full object-contain rounded-t-lg"
        />
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            Hết hàng
          </Badge>
        ) : product?.totalStock < 10 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            {`Only ${product?.totalStock} items left`}
          </Badge>
        ) : product?.salePrice > 0 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            Sale
          </Badge>
        ) : null}
      </div>
      <CardContent className="px-2 pt-2">
        {/* <div onClick={() => handleGetProductDetails(product?._id)}> */}
        <Link to={`/shop/product/${product?._id}`}>
          <h2 className="text-sm cursor-pointer font-bold mb-2">
            {product?.title}
          </h2>
        </Link>
        {/* </div> */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[12px] text-muted-foreground">
            {categoryOptionsMap[product?.category]}
          </span>
          <span className="text-[12px] text-muted-foreground">
            {brandOptionsMap[product?.brand]}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              product?.salePrice > 0 ? "line-through" : ""
            } text-sm font-semibold text-primary`}
          >
            ${product?.price}
          </span>
          {product?.salePrice > 0 ? (
            <span className="text-sm font-semibold text-primary">
              ${product?.salePrice}
            </span>
          ) : null}
        </div>
      </CardContent>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Hết hàng
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full"
          >
            Thêm vào giỏ
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTileListing;
