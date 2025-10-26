import {
  LayoutDashboard,
  Image,
  Package,
  ClipboardList,
  ChartNoAxesCombined,
  Users,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "banners",
    label: "Banners",
    path: "/admin/banners",
    icon: <Image />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <Package />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <ClipboardList />,
  },
  {
    id: "users",
    label: "Users",
    path: "/admin/users",
    icon: <Users />,
  },
  // {
  //   id: "reports",
  //   label: "Reports",
  //   path: "/admin/reports",
  //   icon: <BarChart3 />,
  // },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            if (setOpen) setOpen(false);
          }}
          className="flex cursor-pointer text-lg items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5 items-center">
                <ChartNoAxesCombined size={28} />
                <h1 className="text-2xl font-extrabold">Admin</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2 mb-6"
        >
          <ChartNoAxesCombined size={28} />
          <h1 className="text-2xl font-extrabold">Admin</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
