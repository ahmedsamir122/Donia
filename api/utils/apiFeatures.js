class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1b)advanced filtering
    let filterInterval = [];
    Object.keys(queryObj).forEach((el) => {
      if (el === "username") {
        const regex = new RegExp(`${queryObj[el]}`, "gi");
        this.query = this.query.find({ username: regex });
        delete queryObj[el];
      }

      if (typeof queryObj[el] === "object") {
        queryObj[el] = queryObj[el].map((n) => n.replace(/\n/g, ""));
        const interval = queryObj[el].find((n) => n.includes("-"));
        if (interval) {
          queryObj[el].forEach((n) => {
            filterInterval.push({
              [el]: {
                $gte: n.split("-")[0],
                $lt: n.split("-")[1],
              },
            });
          });
          delete queryObj[el];
        }
      } else {
        queryObj[el] = queryObj[el]?.replace(/\n/g, "");

        if (queryObj[el]?.includes("-")) {
          filterInterval.push({
            [el]: {
              $gte: queryObj[el].split("-")[0],
              $lt: queryObj[el].split("-")[1],
            },
          });
          delete queryObj[el];
        }
      }
    });

    let objectInterval = { $or: filterInterval };
    if (filterInterval.length > 0) {
      this.query = this.query.find(objectInterval);
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate(limit = 20) {
    const page = this.queryString.page * 1 || 1;
    // const limit = this.queryString.limit * 1 || 100;
    // const limit = 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
