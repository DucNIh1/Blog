import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteModal from "../../components/DeleteModal";
import axiosConfig from "../../axios/config";
import { toast } from "react-toastify";
import { RiSearchLine } from "react-icons/ri";
import Pagination from "../../components/Pagination";
import { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";

const Categories = () => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [status, setStatus] = useState(null);
  const [tempName, setTempName] = useState("");
  const [name, setName] = useState(null);

  //for change name
  const [openRename, setOpenRename] = useState(false);
  const [newName, setNewName] = useState("");

  // for add
  const [openAdd, setOpenAdd] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories", { page, status, name }],
    queryFn: async () => {
      try {
        const res = await axiosConfig.get("/api/category", {
          params: {
            page: page,
            limit: 4,
            isActive: status,
            name: name,
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
        toast.success(res.data?.message || "Deleted successfully");
        setOpenDelete(null);
      } catch (error) {
        toast.error("Delete failed");
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
        toast.success(res.data?.message);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", { page, status, name }]);
    },
  });

  const changeNameMutation = useMutation({
    mutationFn: async ({ id, name }) => {
      try {
        const res = await axiosConfig.patch(`/api/category/${id}`, {
          name,
        });

        toast.success(res.data?.message);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", { page, status, name }]);
    },
  });

  const addNewCategoryMutation = useMutation({
    mutationFn: async (name) => {
      try {
        console.log(name);
        const res = await axiosConfig.post("/api/category", {
          name: name,
        });
        toast.success(res.data?.message);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", { page, status, name }]);
    },
  });

  return (
    <div className="bg-white rounded-lg p-8">
      <h1 className="text-xl font-medium bg-gradient-to-r from-blue-400 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text mb-20">
        All Categories
      </h1>

      <div className="flex justify-between gap-5 items-center mb-20">
        <button
          onClick={() => setOpenAdd(true)}
          className="hover:bg-teal-950 bg-teal-600 text-white py-2 px-4 rounded flex gap-2 items-center "
        >
          <span>Add</span> <GoPlus className="size-5 font-semibold" />
        </button>
        {openAdd && (
          <div className="fixed inset-0 bg-black bg-opacity-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white rounded-lg p-5">
              <label
                htmlFor="name"
                className="block mb-4 text-lg text-slate-700 font-medium"
              >
                Add new category
              </label>
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                type="text"
                className="w-full px-4 py-2 mb-5 text-sm border rounded-md outline-none border-slate-400 text-slate-700 focus:border-teal-500"
              />
              <div className="flex">
                <button
                  onClick={() => {
                    addNewCategoryMutation.mutate(newCategory);
                    setOpenAdd(false);
                    setNewCategory("");
                  }}
                  className="block px-8 py-2 mx-auto bg-slate-950 text-primaryText hover:bg-opacity-80"
                >
                  Save
                </button>
                <button
                  onClick={() => setOpenAdd(false)}
                  className="block px-8 py-2 mx-auto bg-red-700 text-primaryText hover:bg-opacity-80"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4  justify-center">
            <input
              placeholder="search"
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="border border-slate-200 focus:border-teal-500  outline-none bg-white rounded-xl px-6 py-2 min-w-[300px] text-sm font-light text-slate-800"
            />
            <RiSearchLine
              onClick={() => setName(tempName)}
              className="cursor-pointer hover:scale-125 hover:text-teal-800 size-5 text-slate-700"
            />
          </div>

          <select
            name="active"
            id="active"
            value={status || ""}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-100 outline-none py-2 px-4 rounded-xl cursor-pointer focus:border focus:border-teal-500 text-sm text-gray-600 "
          >
            <option value="">All status</option>
            <option value={1}>Acitve</option>
            <option value={0}>Unactive</option>
          </select>

          <button
            className="bg-slate-950 px-4 py-2  text-primaryText rounded-md hover:bg-opacity-80"
            onClick={() => {
              setStatus(null);
              setTempName("");
              setName(null);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {categories &&
          categories.map((a) => (
            <div className="flex gap-10 justify-between" key={a.id}>
              <p className="">{a.id}</p>

              <div className="flex items-center gap-3 flex-1 justify-center">
                <h3 className="text-lg font-medium text-slate-800">{a.name}</h3>
                <FaPencil
                  className="cursor-pointer text-slate-700 hover:text-teal-800 hover:scale-125"
                  onClick={() => {
                    setOpenRename(a.id);
                    setNewName(a.name);
                  }}
                />
                {openRename === a.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white rounded-lg p-5">
                      <label
                        htmlFor="name"
                        className="block mb-4 text-sm font-medium"
                      >
                        name
                      </label>
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        type="text"
                        className="w-full px-4 py-2 mb-5 text-sm border rounded-md outline-none border-slate-400 text-slate-700 focus:border-teal-500"
                      />
                      <div className="flex">
                        <button
                          onClick={() => {
                            changeNameMutation.mutate({
                              id: a.id,
                              name: newName,
                            });
                            setOpenRename(false);
                            setNewName("");
                          }}
                          className="block px-8 py-2 mx-auto bg-slate-950 text-primaryText hover:bg-opacity-80"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setOpenRename(false)}
                          className="block px-8 py-2 mx-auto bg-red-700 text-primaryText hover:bg-opacity-80"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="flex-1 text-center">
                <span className="text-gray-600 mr-2"> Total posts: </span>
                {a.total}
              </p>

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
                className="h-10 bg-slate-100 outline-none py-2 px-4 rounded-xl cursor-pointer focus:border focus:border-teal-500 text-sm text-gray-600 "
              >
                <option value={1}>Acitve</option>
                <option value={0}>Unactive</option>
              </select>

              <button
                className="h-10 bg-red-700 px-4 rounded-md text-white hover:bg-red-900"
                onClick={() => setOpenDelete(a?.id)}
              >
                Delete
              </button>
              <DeleteModal
                title="Are you sure you want to delete this user"
                open={openDelete == a?.id}
                setOpen={setOpenDelete}
                onClick={() => deleteMutation.mutate(a?.id)}
              />
            </div>
          ))}
      </div>
      <Pagination page={page} setPage={setPage} total={total} />
    </div>
  );
};

export default Categories;
