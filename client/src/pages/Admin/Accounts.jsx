import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosConfig from "../../axios/config";
import { RiSearchLine } from "react-icons/ri";
import DeleteModal from "../../components/DeleteModal";
import { useState } from "react";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";

const Accounts = () => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [username, setUsername] = useState(null);
  const [status, setStatus] = useState(null);
  const [sort, setSort] = useState(null);
  const [tempUsername, setTempUsername] = useState("");

  const { data: accounts } = useQuery({
    queryKey: ["account", { page, username, status, sort }],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/users", {
          params: {
            page: page,
            limit: 4,
            username: username,
            isActive: status,
            sort: sort,
          },
        });
        setTotal(res.data?.totalPages);
        return res.data?.users;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axiosConfig.delete(`/api/users/${id}`);
        toast.success("Xóa thành công");
        setOpenDelete(null);
      } catch (error) {
        toast.error("Xóa thất bại");
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users", openDelete]);
    },
  });

  const changeActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      try {
        const res = await axiosConfig.patch(`/api/users/${id}/active`, {
          isActive,
        });
        toast.success("Cập nhật thành công");
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      try {
        const res = await axiosConfig.patch(`/api/users/${id}/role`, {
          role,
        });
        toast.success("Cập nhật thành công");
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return (
    <div className="p-8 bg-white rounded-md shadow-md">
      <h1 className="mb-10 text-2xl font-bold text-gray-800 border-b-2 border-[#e7423e] pb-3 inline-block">Tất cả tác giả</h1>

      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="relative w-full max-w-md">
          <input
            placeholder="Tìm kiếm theo tên người dùng..."
            type="text"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            className="border border-gray-200 focus:border-[#e7423e] outline-none bg-white rounded-md px-6 py-3 w-full text-sm font-light text-gray-800 shadow-sm transition-all"
          />
          <RiSearchLine
            onClick={() => setUsername(tempUsername)}
            className="cursor-pointer hover:scale-125 hover:text-[#e7423e] size-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-4 mb-10 rounded-md shadow-sm bg-gray-50">
        <select
          name="active"
          id="active"
          value={status || ""}
          onChange={(e) => setStatus(e.target.value)}
          className="outline-none py-2 px-4 rounded-md cursor-pointer border border-gray-200 focus:border-[#e7423e] text-sm text-gray-800 bg-white shadow-sm transition-all hover:shadow"
        >
          <option value="">Tất cả trạng thái</option>
          <option value={1}>Hoạt động</option>
          <option value={0}>Không hoạt động</option>
        </select>

        <select
          name="sort"
          id="sort"
          value={sort || ""}
          onChange={(e) => setSort(e.target.value)}
          className="outline-none py-2 px-4 rounded-md cursor-pointer border border-gray-200 focus:border-[#e7423e] text-sm text-gray-800 bg-white shadow-sm transition-all hover:shadow"
        >
          <option value="">Sắp xếp: mặc định</option>
          <option value="asc">Mới nhất</option>
          <option value="des">Cũ nhất</option>
        </select>

        <button
          className="px-6 py-2 text-sm font-medium text-gray-700 transition-all bg-gray-100 border border-gray-200 rounded-md shadow-sm hover:bg-gray-200"
          onClick={() => {
            setSort(null);
            setStatus(null);
            setUsername(null);
            setTempUsername("");
          }}
        >
          Đặt lại
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {accounts && accounts.length > 0 ? (
          accounts.map((a) => (
            <div
              className="flex flex-col gap-5 p-4 transition-all bg-white border border-gray-100 rounded-md shadow-sm md:flex-row md:items-center hover:shadow-md"
              key={a.id}
            >
              <img
                src={a.img}
                alt=""
                className="object-cover w-20 h-20 border-2 border-gray-100 rounded-full"
              />

              <div className="flex flex-col flex-1">
                <p className="text-lg font-medium text-gray-800">{a.username}</p>
                <p className="text-sm text-gray-500">{a.email}</p>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Tổng bài viết:</span>{" "}
                  <span className="bg-[#e7423e] bg-opacity-10 inline-block px-2 py-1 text-[#e7423e] text-sm font-medium rounded-md">{a.totalPosts}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 md:flex-nowrap">
                <select
                  name="role"
                  id="role"
                  value={a.role}
                  onChange={(e) =>
                    changeRoleMutation.mutate({ role: e.target.value, id: a.id })
                  }
                  className="px-4 py-2 text-sm text-blue-600 transition-all border border-blue-500 rounded-md outline-none cursor-pointer bg-blue-50 hover:shadow-sm"
                >
                  <option value="admin" className="text-gray-800 bg-white">Quản trị viên</option>
                  <option value="user" className="text-gray-800 bg-white">Người dùng</option>
                </select>

                <select
                  name="active"
                  id="active"
                  value={a.isActive}
                  onChange={(e) =>
                    changeActiveMutation.mutate({
                      id: a.id,
                      isActive: e.target.value,
                    })
                  }
                  className={`px-4 py-2 rounded-md outline-none border cursor-pointer text-sm transition-all ${a.isActive == 1
                    ? "border-green-600 text-green-700 bg-green-50"
                    : "border-gray-400 text-gray-700 bg-gray-50"
                    }`}
                >
                  <option value={1} className="text-gray-800 bg-white">Hoạt động</option>
                  <option value={0} className="text-gray-800 bg-white">Không hoạt động</option>
                </select>

                <button
                  className="px-4 py-2 bg-[#e7423e] rounded-md text-white hover:bg-opacity-90 transition-all text-sm font-medium shadow-sm hover:shadow"
                  onClick={() => setOpenDelete(a?.id)}
                >
                  Xóa
                </button>

                <DeleteModal
                  title="Bạn có chắc chắn muốn xóa người dùng này không?"
                  open={openDelete == a?.id}
                  setOpen={setOpenDelete}
                  onClick={() => deleteMutation.mutate(a?.id)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="w-full py-10 text-center text-gray-500">
            Không tìm thấy tài khoản nào. Hãy thử điều chỉnh bộ lọc của bạn.
          </div>
        )}
      </div>

      <div className="mt-8">
        <Pagination page={page} setPage={setPage} total={total} />
      </div>
    </div>
  );
};

export default Accounts;