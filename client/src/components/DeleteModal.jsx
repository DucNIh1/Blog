/* eslint-disable react/prop-types */
import { PiWarningCircleLight } from "react-icons/pi";

const DeleteModal = ({
  title = "Are you sure you want to delete this post?",
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
            <p className="text-gray-500">{title}</p>
            <div className="flex gap-5">
              <button
                className="px-6 py-4 text-sm text-white bg-red-600 rounded-lg outline-none hover:bg-red-800"
                onClick={onClick}
              >
                Yes, I&apos;m sure
              </button>
              <button
                className="outline-none min-w-[120px] py-4 px-6 text-sm rounded-lg bg-slate-950 hover:bg-opacity-70 text-primaryText"
                onClick={() => setOpen(false)}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
