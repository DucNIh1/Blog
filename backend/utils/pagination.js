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

};
export default paginateQuery;
