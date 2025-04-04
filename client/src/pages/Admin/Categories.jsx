import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosConfig from "../../axios/config";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import DeleteModal from "../../components/DeleteModal";
import { toast } from "react-toastify";
import { RiSearchLine } from "react-icons/ri";

// Màu sắc trạng thái
const statusColors = {
  active: "border-green-600 text-green-700 bg-green-50",
  inactive: "border-red-600 text-red-700 bg-red-50",
};

const Categories = () => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [updateCategory, setUpdateCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [status, setStatus] = useState(null);
  const [tempName, setTempName] = useState("");
  const [name, setName] = useState(null);

  const { data: categories } = useQuery({
    queryKey: ["categories", { page, status, name }],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/category", {
          params: {
            page,
            limit: 4,
            isActive: status,
            name,
          },
        });
        setTotal(res.data?.totalPages);
        return res.data?.categories;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axiosConfig.delete(`/api/category/${id}`);
        toast.success("Xóa thành công");
        setOpenDelete(false);
      } catch (error) {
        toast.error("Xóa thất bại");
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", { page, status, name }]);
    },
  });

  const changeActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      try {
        const res = await axiosConfig.patch(`/api/category/${id}`, {
          isActive,
        });
        toast.success("Cập nhật thành công");
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", { page, status, name }]);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, name }) => {
      try {
        const res = await axiosConfig.patch(`/api/category/${id}`, {
          name,
        });
        toast.success("Cập nhật danh mục thành công");
        setOpenUpdateModal(false);
        setUpdateCategory(null);
        return res.data;
      } catch (error) {
        toast.error("Cập nhật danh mục thất bại");
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", { page, status, name }]);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (name) => {
      try {
        const res = await axiosConfig.post("/api/category", { name });
        toast.success("Thêm danh mục thành công");
        setOpenCreateModal(false);
        setNewCategoryName("");
        return res.data;
      } catch (error) {
        if (error.response?.data?.message === "This category already exists") {
          toast.error("Danh mục này đã tồn tại");
        } else {
          toast.error("Thêm danh mục thất bại");
        }
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    createCategoryMutation.mutate(newCategoryName);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (!updateCategory.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    updateCategoryMutation.mutate({
      id: updateCategory.id,
      name: updateCategory.name,
    });
  };

  const handleOpenUpdateModal = (category) => {
    setUpdateCategory({
      id: category.id,
      name: category.name,
    });
    setOpenUpdateModal(true);
  };

  useEffect(() => {
    setPage(1);
  }, [status, name]);

  return (
    <div className="p-8 bg-white rounded-md shadow-md">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-[#e7423e] pb-3 inline-block">
          Tất cả danh mục
        </h1>
        <button
          onClick={() => setOpenCreateModal(true)}
          className="px-4 py-2 bg-[#e7423e] rounded-md text-white hover:bg-opacity-90 transition-all text-sm font-medium shadow-sm hover:shadow flex items-center gap-1"
        >
          <span className="text-lg">+</span> Thêm danh mục
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="relative w-full max-w-md">
          <input
            placeholder="Tìm kiếm theo tên danh mục..."
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="border border-gray-200 focus:border-[#e7423e] outline-none bg-white rounded-md px-6 py-3 w-full text-sm font-light text-gray-800 shadow-sm transition-all"
          />
          <RiSearchLine
            onClick={() => setName(tempName)}
            className="cursor-pointer hover:scale-125 hover:text-[#e7423e] size-5 text-gray-500 absolute right-4 top-1/2 transform -translate-y-1/2 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-4 mb-10 rounded-md shadow-sm bg-gray-50">
        <select
          name="status"
          id="status"
          value={status || ""}
          onChange={(e) => setStatus(e.target.value)}
          className="outline-none py-2 px-4 rounded-md cursor-pointer border border-gray-200 focus:border-[#e7423e] text-sm text-gray-800 bg-white shadow-sm transition-all hover:shadow"
        >
          <option value="">Tất cả trạng thái</option>
          <option value={1}>Hoạt động</option>
          <option value={0}>Không hoạt động</option>
        </select>

        <button
          className="px-6 py-2 text-sm font-medium text-gray-700 transition-all bg-gray-100 border border-gray-200 rounded-md shadow-sm hover:bg-gray-200"
          onClick={() => {
            setStatus(null);
            setTempName("");
            setName(null);
            setPage(1);
          }}
        >
          Đặt lại
        </button>
      </div>

      <div className="flex flex-col items-start gap-8">
        {categories?.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col w-full gap-5 p-4 transition-all bg-white border border-gray-100 rounded-md shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col flex-1 gap-3">
                <h2 className="text-gray-800 text-lg font-medium mb-2 hover:text-[#e7423e] transition-colors">
                  {category.name}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Tổng số bài viết: {category.total}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                <select
                  name="isActive"
                  id="isActive"
                  value={category.isActive}
                  onChange={(e) =>
                    changeActiveMutation.mutate({
                      id: category.id,
                      isActive: e.target.value,
                    })
                  }
                  className={`px-4 py-2 rounded-md outline-none border cursor-pointer text-sm transition-all ${statusColors[category.isActive ? "active" : "inactive"]
                    }`}
                >
                  <option value={1} className="text-gray-800 bg-white">
                    Hoạt động
                  </option>
                  <option value={0} className="text-gray-800 bg-white">
                    Không hoạt động
                  </option>
                </select>

                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 text-sm font-medium text-white transition-all bg-blue-500 rounded-md shadow-sm hover:bg-opacity-90 hover:shadow"
                    onClick={() => handleOpenUpdateModal(category)}
                  >
                    Sửa
                  </button>

                  <button
                    className="px-4 py-2 bg-[#e7423e] rounded-md text-white hover:bg-opacity-90 transition-all text-sm font-medium shadow-sm hover:shadow"
                    onClick={() => setOpenDelete(category?.id)}
                  >
                    Xóa
                  </button>
                </div>

                <DeleteModal
                  setOpen={setOpenDelete}
                  onClick={() => deleteMutation.mutate(category?.id)}
                  open={openDelete == category?.id}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="w-full py-10 text-center text-gray-500">
            Không tìm thấy danh mục nào. Hãy thử điều chỉnh bộ lọc của bạn.
          </div>
        )}
        <div className="w-full">
          <Pagination page={page} setPage={setPage} total={total} />
        </div>
      </div>

      {/* Modal thêm danh mục */}
      {openCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Thêm danh mục mới</h3>
              <button
                onClick={() => {
                  setOpenCreateModal(false);
                  setNewCategoryName("");
                }}
                className="text-xl text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateCategory}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block mb-2 text-sm font-medium text-gray-700">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e7423e] focus:border-transparent"
                  placeholder="Nhập tên danh mục"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setOpenCreateModal(false);
                    setNewCategoryName("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#e7423e] rounded-md hover:bg-opacity-90 transition-all"
                  disabled={createCategoryMutation.isLoading}
                >
                  {createCategoryMutation.isLoading ? "Đang xử lý..." : "Thêm danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal sửa danh mục */}
      {openUpdateModal && updateCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Sửa danh mục</h3>
              <button
                onClick={() => {
                  setOpenUpdateModal(false);
                  setUpdateCategory(null);
                }}
                className="text-xl text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateCategory}>
              <div className="mb-4">
                <label htmlFor="updateCategoryName" className="block mb-2 text-sm font-medium text-gray-700">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  id="updateCategoryName"
                  value={updateCategory.name}
                  onChange={(e) => setUpdateCategory({ ...updateCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e7423e] focus:border-transparent"
                  placeholder="Nhập tên danh mục"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setOpenUpdateModal(false);
                    setUpdateCategory(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white transition-all bg-blue-500 rounded-md hover:bg-opacity-90"
                  disabled={updateCategoryMutation.isLoading}
                >
                  {updateCategoryMutation.isLoading ? "Đang xử lý..." : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;