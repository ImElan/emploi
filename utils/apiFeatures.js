class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryParams = { ...this.queryString };
        // console.log(queryParams);
        const excludedQuery = ['fields', 'sort', 'page', 'limit'];
        excludedQuery.forEach((query) => delete queryParams[query]);
        let queryString = JSON.stringify(queryParams);
        queryString = queryString.replace(
            /\b(lt|lte|gt|gte)\b/g,
            (matchedWord) => `$${matchedWord}`
        );
        const filteredQueryParams = JSON.parse(queryString);
        // console.log(filteredQueryParams);
        this.query = this.query.find(filteredQueryParams);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort;
            sortBy = sortBy.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            let limitFields = this.queryString.fields;
            limitFields = limitFields.split(',').join(' ');
            this.query = this.query.select(limitFields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 100;
        const skipValue = (page - 1) * limit;
        this.query = this.query.skip(skipValue).limit(limit);
        return this;
    }
}

module.exports = ApiFeatures;
