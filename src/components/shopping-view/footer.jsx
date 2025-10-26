import {
  shoppingViewHeaderMenuItems,
  categoryOptionsMap,
  brandOptionsMap,
} from "@/config";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="bg-black w-full h-full text-white  ">
      <div className="w-[80%] mx-auto my-10">
        <div className=" grid grid-cols-1 gap-6 md:grid-cols-4 ">
          <div>
            <span className="text-4xl font-bold">
              STORE
            </span>
            <p className="mt-3">Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
            <p className="mt-3">Email: abc@gmail.com</p>
            <p className="mt-3">Số điện thoại: 0123456789</p>
          </div>
          <div>
            {shoppingViewHeaderMenuItems.map((item, index) => (
              <div key={index} className="mt-3">
                <Link to={item.path}>{item.label}</Link>
              </div>
            ))}
          </div>
          <div>
            {categoryOptionsMap && (
              <div>
                <b>Danh mục</b>
                {Object.keys(categoryOptionsMap).map((key, index) => (
                  <div key={index} className="mt-3">
                    <Link to={`/shop/listing?category=${key}`}>
                      {categoryOptionsMap[key]}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {brandOptionsMap && (
              <div className="mt-5">
                <b>Thương hiệu</b>
                {Object.keys(brandOptionsMap).map((key, index) => (
                  <div key={index} className="mt-3">
                    <Link to={`/shop/listing?brand=${key}`}>
                      {brandOptionsMap[key]}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
