class APIFeatures {
  constructor(mongooseQueryObject, clientQueryString) {
    this.mongooseQueryObject = mongooseQueryObject;
    this.clientQueryString = clientQueryString;
  }

  filter() {
    const queryObj = { ...this.clientQueryString };
    const toBeEliminatedQueries = [
      'sort',
      'page',
      'limit',
      'fields',
    ];
    toBeEliminatedQueries.forEach((el) => {
      delete queryObj[el];
    });

    // 2) BUILD UP query obj
    // A) Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte)|(lt)|(lte)|(gt)\b/g,
      (str) => `$${str}`
    );

    this.mongooseQueryObject.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    const sortStr =
      this.clientQueryString.sort?.split(',').join(' ') ||
      '-createdAt';

    this.mongooseQueryObject.sort(sortStr);

    return this;
  }

  project() {
    const fields =
      this.clientQueryString.fields?.split(',').join(' ') ||
      '-__v';

    this.mongooseQueryObject.select(fields);

    return this;
  }

  paginate() {
    const limit = +this.clientQueryString.limit || 0;
    const page = +this.clientQueryString.page || 1;
    const skip = (page - 1) * limit;

    this.mongooseQueryObject.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
