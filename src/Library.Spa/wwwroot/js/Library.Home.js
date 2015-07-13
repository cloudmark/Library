var Library;
(function (Library) {
    var Services;
    (function (Services) {
        angular.module("Library.Services", []);
    })(Services = Library.Services || (Library.Services = {}));
})(Library || (Library = {}));
/// <reference path="../bower_components/dt-angular/angular.d.ts" /> 
/// <reference path="../bower_components/dt-angular/angular-route.d.ts" />
/// <reference path="../bower_components/dt-angular-ui-bootstrap/angular-ui-bootstrap.d.ts" /> 
/// <reference path="..\..\Library.Services.ng.ts" />
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
        angular.module("Library.Services")
            .service("Library.Services.IBookApiService", [
            "$cacheFactory",
            "$q",
            "$http",
            "Library.UrlResolver.IUrlResolverService",
            BookApiService
        ]);
    })(Services = Library.Services || (Library.Services = {}));
})(Library || (Library = {}));
var Library;
(function (Library) {
    var UrlResolver;
    (function (UrlResolver) {
        angular.module("Library.UrlResolver", []);
    })(UrlResolver = Library.UrlResolver || (Library.UrlResolver = {}));
})(Library || (Library = {}));
/// <reference path="..\..\Library.UrlResolver.ng.ts" />
var Library;
(function (Library) {
    var UrlResolver;
    (function (UrlResolver) {
        var UrlResolverService = (function () {
            function UrlResolverService($rootElement) {
                // this._base = $rootElement.attr("data-url-base");
                // TODO: Fix this to use a template html page so that we can inject properties.  
                this._base = "http://localhost:5004/";
                // Add trailing slash if not present
                if (this._base === "" || this._base.substr(this._base.length - 1) !== "/") {
                    this._base = this._base + "/";
                }
            }
            Object.defineProperty(UrlResolverService.prototype, "base", {
                get: function () {
                    return this._base;
                },
                enumerable: true,
                configurable: true
            });
            UrlResolverService.prototype.resolveUrl = function (relativeUrl) {
                var firstChar = relativeUrl.substr(0, 1);
                if (firstChar === "~") {
                    relativeUrl = relativeUrl.substr(1);
                }
                firstChar = relativeUrl.substr(0, 1);
                if (firstChar === "/") {
                    relativeUrl = relativeUrl.substr(1);
                }
                return this._base + relativeUrl;
            };
            return UrlResolverService;
        })();
        angular.module("Library.UrlResolver")
            .service("Library.UrlResolver.IUrlResolverService", [
            "$rootElement",
            UrlResolverService
        ]);
    })(UrlResolver = Library.UrlResolver || (Library.UrlResolver = {}));
})(Library || (Library = {}));
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Book;
        (function (Book) {
            angular.module("Library.Home.Book", []);
        })(Book = Home.Book || (Home.Book = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
/// <reference path="..\..\Library.Home.Book.ng.ts" />
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Book;
        (function (Book) {
            var HomeController = (function () {
                function HomeController(bookApi) {
                    var viewModel = this;
                    bookApi.getBooks().then(function (books) {
                        viewModel.books = books;
                    });
                }
                return HomeController;
            })();
            angular.module("Library.Home.Book")
                .controller("Library.Home.Book.HomeController", [
                "Library.Services.IBookApiService",
                HomeController
            ]);
        })(Book = Home.Book || (Home.Book = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
/// <reference path="../references.ts" />
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        angular.module("Library.Home", [
            "ngRoute",
            "Library.UrlResolver",
            "Library.Services",
            "Library.Home.Book",
        ]).config([
            "$routeProvider",
            "$logProvider",
            configuration
        ]).run([
            "$log",
            "Library.Services.IBookApiService",
            run
        ]);
        var dependencies = [
            "ngRoute",
            Library.UrlResolver,
            Library.Services,
            Library.Home.Book
        ];
        // Use this method to register work which needs to be performed on module loading.
        // Note only providers can be injected as dependencies here.
        function configuration($routeProvider, $logProvider) {
            // TODO: Enable debug logging based on server config
            // TODO: Capture all logged errors and send back to server
            $logProvider.debugEnabled(true);
            $routeProvider
                .when("/", { templateUrl: "ng-apps/Library.Home/Home/Home.html" })
                .when("/book", { templateUrl: "ng-apps/Library.Home/Book/Book.html" })
                .when("/loan", { templateUrl: "ng-apps/Library.Home/Loan/Loan.html" })
                .when("/user", { templateUrl: "ng-apps/Library.Home/User/User.html" })
                .otherwise({ redirectTo: "/" });
        }
        // Use this method to register work which should be performed when the injector is done loading all modules.
        function run($log, bookService) {
            $log.log("Loaded Everything");
        }
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
