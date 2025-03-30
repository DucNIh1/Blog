/* eslint-disable react/prop-types */
import { PiWarningCircleLight } from "react-icons/pi";

const DeleteModal = ({
  title = "Bạn có chắc chắn muốn xóa bài viết này?",
  onClick,
  open,
  setOpen,
}) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-20">
          <div className="rounded-lg w-full p-5 py-10 items-center  max-w-[500px] flex flex-col gap-5 absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <PiWarningCircleLight className="size-12" />
            <p className="mb-5 text-gray-900">{title}</p>
            <div className="flex justify-between gap-10">
              <button
                className="px-6 py-4 text-sm text-white bg-[#E7423E] rounded-sm outline-none hover:bg-opacity-70"
                onClick={onClick}
              >
                Chắc chắn
              </button>
              <button
                className="outline-none min-w-[120px] py-4 px-6 text-sm rounded-sm bg-slate-950 hover:bg-opacity-70 text-primaryText"
                onClick={() => setOpen(false)}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
