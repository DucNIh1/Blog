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
  const [page, setPage] = useState();
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
        console.log(id);
        const res = await axiosConfig.delete(`/api/users/${id}`);
        toast.success(res.data?.message || "Deleted successfully");
        setOpenDelete(null);
      } catch (error) {
        toast.error("Delete failed");
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
        toast.success(res.data?.message);
        console.log(res);
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
        toast.success(res.data?.message);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return (
    <div className="bg-white rounded-lg p-8">
      <h1 className="text-xl font-medium text-gray-900">All authors</h1>

      <div className="flex justify-end gap-5 items-start mb-10">
        <div className="flex items-center gap-4 mb-10 justify-center">
          <input
            placeholder="search"
            type="text"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            className="border border-slate-200 focus:border-teal-500  outline-none bg-white rounded-xl px-6 py-2 min-w-[300px] text-sm font-light text-slate-800"
          />
          <RiSearchLine
            onClick={() => setUsername(tempUsername)}
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
        <select
          name="sort"
          id="sort"
          value={sort || ""}
          onChange={(e) => setSort(e.target.value)}
          className="bg-slate-100 outline-none py-2 px-4 rounded-xl cursor-pointer focus:border focus:border-teal-500 text-sm text-gray-600 "
        >
          <option value="">Sort by: default</option>
          <option value="asc">Sort by: Newest</option>
          <option value="des"> Sort by: Oldest</option>
        </select>
        <button
          className="bg-slate-950 px-4 py-2  text-primaryText rounded-md hover:bg-opacity-80"
          onClick={() => {
            setSort(null);
            setStatus(null);
            setUsername(null);
            setTempUsername("");
          }}
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {accounts &&
          accounts.map((a) => (
            <div className="flex gap-10 justify-between" key={a.id}>
              <img
                src={a.img}
                alt=""
                className=" w-20 h-20 rounded-full object-cover"
              />
              <p className="flex-1 text-center">{a.username}</p>
              <p className="min-w-[280px]">{a.email}</p>
              <p className="flex-1 text-center">
                {" "}
                <span className="text-gray-600"> Total posts:</span>{" "}
                {a.totalPosts}
              </p>

              <select
                name="role"
                id="role"
                value={a.role}
                onChange={(e) =>
                  changeRoleMutation.mutate({ role: e.target.value, id: a.id })
                }
                className=" h-10 bg-slate-100 outline-none py-2 px-4 rounded-xl cursor-pointer focus:border focus:border-teal-500 text-sm text-gray-600 "
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
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

export default Accounts;
