/// <reference path="../../references.ts" /> 
var Library;
(function (Library) {
    var Services;
    (function (Services) {
        var LoanApiService = (function () {
            function LoanApiService($cacheFactory, $q, $http, urlResolver) {
                this._inlineData = $cacheFactory.get("inlineData");
                this._q = $q;
                this._http = $http;
                this._urlResolver = urlResolver;
            }
            LoanApiService.prototype.getLoans = function (page, pageSize, sortBy) {
                var url = this._urlResolver.resolveUrl("~/api/loan");
                var query = {};
                var querySeparator = "?";
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
                var inlineData = this._inlineData ? this._inlineData.get(url) : null;
                if (inlineData) {
                    return this._q.when(inlineData);
                }
                else {
                    return this._http.get(url).then(function (result) { return result.data.Data; });
                }
            };
            LoanApiService.prototype.addLoan = function (book) {
                var url = this._urlResolver.resolveUrl("~/api/loan");
                return this._http.post(url, book).then(function (result) { return result.data.Data; });
            };
            LoanApiService.prototype.endLoan = function (loanId) {
                var url = this._urlResolver.resolveUrl("~/api/loan/" + loanId);
                return this._http.delete(url).then(function (result) { return result.data; });
            };
            return LoanApiService;
        })();
    })(Services = Library.Services || (Library.Services = {}));
})(Library || (Library = {}));
