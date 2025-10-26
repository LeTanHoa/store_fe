export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Nhập tên người dùng",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Nhập địa chỉ email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Nhập mật khẩu",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Nhập địa chỉ email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Nhập mật khẩu",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Nhập tên sản phẩm",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Nhập mô tả sản phẩm",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "smartphone", label: "Điện thoại" },
      { id: "laptop", label: "Laptop" },
      { id: "tablet", label: "Máy tính bảng" },
      { id: "headphone", label: "Tai nghe" },
      { id: "smartwatch", label: "Đồng hồ thông minh" },
      { id: "accessories", label: "Phụ kiện" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "apple", label: "Apple" },
      { id: "samsung", label: "Samsung" },
      { id: "xiaomi", label: "Xiaomi" },
      { id: "oppo", label: "Oppo" },
      { id: "asus", label: "Asus" },
      { id: "dell", label: "Dell" },
    ],
  },

  {
    label: "Giá",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Nhập giá sản phẩm",
  },
  {
    label: "Giá khuyến mãi",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Nhập giá khuyến mãi (nếu có)",
  },
  {
    label: "Số lượng tồn kho",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Nhập tổng số lượng tồn kho",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Trang chủ",
    path: "/shop/home",
  },
  // {
  //   id: "products",
  //   label: "Sản phẩm",
  //   path: "/shop/listing",
  // },
  {
    id: "smartphone",
    label: "Điện thoại",
    path: "/shop/listing",
  },
  {
    id: "laptop",
    label: "Laptop",
    path: "/shop/listing",
  },
  {
    id: "tablet",
    label: "Máy tính bảng",
    path: "/shop/listing",
  },
  {
    id: "headphone",
    label: "Tai nghe",
    path: "/shop/listing",
  },
  {
    id: "smartwatch",
    label: "Đồng hồ ",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Phụ kiện",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Tìm kiếm",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  smartphone: "Điện thoại",
  laptop: "Laptop",
  tablet: "Máy tính bảng",
  headphone: "Tai nghe",
  smartwatch: "Đồng hồ thông minh",
  accessories: "Phụ kiện",
};

export const brandOptionsMap = {
  apple: "Apple",
  samsung: "Samsung",
  xiaomi: "Xiaomi",
  oppo: "Oppo",
  asus: "Asus",
  dell: "Dell",
};

export const filterOptions = {
  category: [
    { id: "smartphone", label: "Điện thoại" },
    { id: "laptop", label: "Laptop" },
    { id: "tablet", label: "Máy tính bảng" },
    { id: "headphone", label: "Tai nghe" },
    { id: "smartwatch", label: "Đồng hồ thông minh" },
    { id: "accessories", label: "Phụ kiện" },
  ],
  brand: [
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "xiaomi", label: "Xiaomi" },
    { id: "oppo", label: "Oppo" },
    { id: "asus", label: "Asus" },
    { id: "dell", label: "Dell" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Giá: Thấp đến cao" },
  { id: "price-hightolow", label: "Giá: Cao đến thấp" },
  { id: "title-atoz", label: "Từ: A đến Z" },
  { id: "title-ztoa", label: "Từ: Z đến A" },
];

export const addressFormControls = [
  {
    label: "Địa chỉ",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Nhập địa chỉ",
  },
  {
    label: "Thành phố",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Nhập thành phố",
  },
  {
    label: "Mã code",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Nhập mã code",
  },
  {
    label: "Số điện thoại",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Nhập số điện thoại",
  },
  {
    label: "Ghi chú",
    name: "notes",
    componentType: "textarea",
    placeholder: "Nhập ghi chú (nếu có)",
  },
];
