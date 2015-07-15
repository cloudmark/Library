/// <reference path="../../references.ts" /> 
var Library;
(function (Library) {
    var Services;
    (function (Services) {
        var UserApiService = (function () {
            function UserApiService($cacheFactory, $q, $http, urlResolver) {
                this._inlineData = $cacheFactory.get("inlineData");
                this._q = $q;
                this._http = $http;
                this._urlResolver = urlResolver;
            }
            UserApiService.prototype.getUsers = function (page, pageSize, sortBy) {
                var url = this._urlResolver.resolveUrl("~/api/user");
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
            UserApiService.prototype.getUser = function (userId) {
                var url = this._urlResolver.resolveUrl("~/api/user/" + userId);
                return this._http.get(url).then(function (result) { return result.data.Data; });
            };
            UserApiService.prototype.addUser = function (book) {
                var url = this._urlResolver.resolveUrl("~/api/user");
                return this._http.post(url, book).then(function (result) { return result.data.Data; });
            };
            UserApiService.prototype.updateUser = function (user) {
                var url = this._urlResolver.resolveUrl("~/api/user/" + user.Id);
                this._http.put(url, user);
            };
            return UserApiService;
        })();
    })(Services = Library.Services || (Library.Services = {}));
})(Library || (Library = {}));
