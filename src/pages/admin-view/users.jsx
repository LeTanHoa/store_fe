import { useEffect } from "react";
import { fetchAllUsers } from "@/store/admin/user-slice";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Popconfirm, Tag, message } from "antd";
import axios from "axios";

const AdminUsers = () => {
  const dispatch = useDispatch();

  const { userList } = useSelector((state) => state.adminUser);
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDeleteUser = (userId) => {
    const res = axios.delete(
      `http://storebe-api.vercel.app/api/admin/users/delete/${userId}`
    );
    res
      .then(() => {
        message.success("Xóa người dùng thành công");
        dispatch(fetchAllUsers());
      })
      .catch(() => {
        message.error("Không thể xóa người dùng");
      });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => <strong>{index + 1}</strong>,
      width: 70,
    },
    {
      title: "Tên người dùng",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) =>
        role === "admin" ? (
          <Tag color="green">Admin</Tag>
        ) : (
          <Tag color="blue">User</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Popconfirm
            title="Xác nhận xóa"
            description={`Bạn có chắc muốn xóa người dùng "${record.userName}" không?`}
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeleteUser(record._id)}
          >
            <Button danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>

        <Table
          columns={columns}
          dataSource={userList}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default AdminUsers;
