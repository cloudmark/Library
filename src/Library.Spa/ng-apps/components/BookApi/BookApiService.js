/// <reference path="../../references.ts" /> 
var Library;
(function (Library) {
    var Services;
    (function (Services) {
        var BookApiService = (function () {
            function BookApiService($cacheFactory, $q, $http, urlResolver) {
                this._inlineData = $cacheFactory.get("inlineData");
                this._q = $q;
                this._http = $http;
                this._urlResolver = urlResolver;
            }
            BookApiService.prototype.getBooks = function (page, pageSize, sortBy) {
                var url = this._urlResolver.resolveUrl("~/api/books"), query = {}, querySeparator = "?", inlineData;
                if (page) {
                    query.page = page;
                }
                if (pageSize) {
                    query.pageSize = pageSize;
                }
                if (sortBy) {
                    query.sortBy = sortBy;
                }
                for (var key in query) {
                    if (query.hasOwnProperty(key)) {
                        url += querySeparator + key + "=" + encodeURIComponent(query[key]);
                        if (querySeparator === "?") {
                            querySeparator = "&";
                        }
                    }
                }
                inlineData = this._inlineData ? this._inlineData.get(url) : null;
                if (inlineData) {
                    return this._q.when(inlineData);
                }
                else {
                    return this._http.get(url).then(function (result) { return result.data; });
                }
            };
            return BookApiService;
        })();
    })(Services = Library.Services || (Library.Services = {}));
})(Library || (Library = {}));
