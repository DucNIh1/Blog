import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import ReactPaginate from "react-paginate";

// eslint-disable-next-line react/prop-types
const Pagination = ({ page, setPage, total }) => {
  return (
    <div className="flex justify-center mt-8 mb-20">
      <ReactPaginate
        previousLabel={
          <GrFormPrevious
            className={`size-8 ${page == 1 ? "text-slate-400" : ""}`}
          />
        }
        nextLabel={
          <GrFormNext
            className={`size-8 ${page == total ? "text-slate-400" : ""}`}
          />
        }
        breakLabel={"..."}
        pageCount={total}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={(e) => setPage(e.selected + 1)}
        containerClassName={"pagination flex gap-3 items-center"}
        activeClassName={"active  bg-black"}
      />
    </div>
  );
};

export default Pagination;
