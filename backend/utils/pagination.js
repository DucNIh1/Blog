const paginateQuery = (
  connection,
  baseQuery,
  queryParams = [],
  page = 1,
  limit = 10
) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    const paginationQuery = `${baseQuery} LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(*) AS total FROM (${baseQuery}) AS totalCount`;
    connection.query(countQuery, [...queryParams], (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
  //   try {
  //     const offset = (page - 1) * limit; //ok
  //     const paginatedQuery = `${baseQuery} LIMIT ? OFFSET ?`; //ok

  //     // Thực hiện truy vấn với phân trang
  //     console.log([...queryParams, limit, offset]);

  //     const countQuery = `SELECT COUNT(*) AS total FROM (${baseQuery}) AS totalCount`;
  //     const [totalResults] = connection.query(countQuery, [
  //       ...queryParams,
  //       limit,
  //       offset,
  //     ]);

  //     return [totalResults];
  //   } catch (error) {
  //     return error;
  //   }
  // const [totalResults] = connection.execute(
  //   paginatedQuery,
  //   queryParams.length > 0
  //     ? [...queryParams, limit, offset]
  //     : [limit, offset],
  //   (err, results) => {
  //     if (err) {
  //       return reject(err);
  //     }

  //     // Truy vấn đếm tổng số bản ghi, giữ nguyên các điều kiện của baseQuery

  //     connection.execute(countQuery, queryParams, (err, countResults) => {
  //       if (err) {
  //         return reject(err);
  //       }

  //       const totalRecords = countResults[0].total;
  //       const totalPages = Math.ceil(totalRecords / limit);

  //       // Trả về dữ liệu phân trang
  //       resolve({
  //         data: results,
  //         totalRecords,
  //         totalPages,
  //         currentPage: page,
  //         limit,
  //       });
  //     });
  //   }
  // );
};
export default paginateQuery;
