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
                var url = this._urlResolver.resolveUrl("~/api/books");
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
            BookApiService.prototype.requestBook = function (book) {
                var url = this._urlResolver.resolveUrl("~/api/books");
                return this._http.post(url, book).then(function (result) { return result.data.Data; });
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
                this._base = $rootElement.attr("data-url-base");
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
            var BookController = (function () {
                function BookController($scope, bookApi) {
                    this.books = [];
                    this.filters = {
                        Id: "",
                        Name: "",
                        Description: ""
                    };
                    this.currentBook = {
                        Id: -1,
                        Name: "",
                        Description: ""
                    };
                    this.$scope = $scope;
                    this.bookApi = bookApi;
                    this.refreshBooks();
                }
                BookController.prototype.refreshBooks = function () {
                    var _this = this;
                    this.bookApi.getBooks().then(function (books) {
                        _this.books.length = 0;
                        _this.books.push.apply(_this.books, books);
                    });
                };
                BookController.prototype.clearFilters = function () {
                    this.filters.Id = "";
                    this.filters.Name = "";
                    this.filters.Description = "";
                };
                BookController.prototype.requestBook = function () {
                    var _this = this;
                    debugger;
                    this.bookApi.requestBook(this.currentBook).then(function (book) {
                        _this.currentBook = {
                            Id: -1,
                            Name: "",
                            Description: ""
                        };
                        _this.books.push.apply(_this.books, [book]);
                    });
                };
                return BookController;
            })();
            angular.module("Library.Home.Book")
                .controller("Library.Home.Book.BookController", [
                "$scope",
                "Library.Services.IBookApiService",
                BookController
            ]);
        })(Book = Home.Book || (Home.Book = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
var Library;
(function (Library) {
    var Home;
    (function (Home_1) {
        var Home;
        (function (Home) {
            angular.module("Library.Home.Home", []);
        })(Home = Home_1.Home || (Home_1.Home = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
/// <reference path="..\..\Library.Home.Home.ng.ts" />
var Library;
(function (Library) {
    var Home;
    (function (Home_2) {
        var Home;
        (function (Home) {
            var HomeController = (function () {
                function HomeController() {
                    var viewModel = this;
                }
                return HomeController;
            })();
            angular.module("Library.Home.Home")
                .controller("Library.Home.Home.HomeController", [
                HomeController
            ]);
        })(Home = Home_2.Home || (Home_2.Home = {}));
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
            "Library.Home.Home",
            "Library.Home.User",
            "Library.Home.Loan",
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
            Library.Home.Home,
            Library.Home.User,
            Library.Home.Loan,
            Library.Home.Book
        ];
        // Use this method to register work which needs to be performed on module loading.
        // Note only providers can be injected as dependencies here.
        function configuration($routeProvider, $logProvider) {
            // TODO: Enable debug logging based on server config
            // TODO: Capture all logged errors and send back to server
            $logProvider.debugEnabled(true);
            $routeProvider
                .when("/", {
                templateUrl: "ng-apps/Library.Home/Home/Home.html",
                controller: "Library.Home.Home.HomeController",
                controllerAs: "ctrl"
            })
                .when("/book", {
                templateUrl: "ng-apps/Library.Home/Book/Book.html",
                controller: "Library.Home.Book.BookController",
                controllerAs: "ctrl"
            })
                .when("/loan", {
                templateUrl: "ng-apps/Library.Home/Loan/Loan.html",
                controller: "Library.Home.Loan.LoanController",
                controllerAs: "ctrl"
            })
                .when("/user", {
                templateUrl: "ng-apps/Library.Home/User/User.html",
                controller: "Library.Home.User.UserController",
                controllerAs: "ctrl"
            })
                .otherwise({ redirectTo: "/" });
        }
        // Use this method to register work which should be performed when the injector is done loading all modules.
        function run($log, bookService) {
            $('#menu-toggle').click(function (e) {
                e.preventDefault();
                $('#wrapper').toggleClass('toggled');
            });
        }
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Loan;
        (function (Loan) {
            angular.module("Library.Home.Loan", []);
        })(Loan = Home.Loan || (Home.Loan = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
/// <reference path="..\..\Library.Home.Loan.ng.ts" />
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Loan;
        (function (Loan) {
            var LoanController = (function () {
                function LoanController() {
                    var viewModel = this;
                }
                return LoanController;
            })();
            angular.module("Library.Home.Loan")
                .controller("Library.Home.Loan.LoanController", [
                LoanController
            ]);
        })(Loan = Home.Loan || (Home.Loan = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var User;
        (function (User) {
            angular.module("Library.Home.User", []);
        })(User = Home.User || (Home.User = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
/// <reference path="..\..\Library.Home.User.ng.ts" />
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var User;
        (function (User) {
            var UserController = (function () {
                function UserController() {
                    var viewModel = this;
                }
                return UserController;
            })();
            angular.module("Library.Home.User")
                .controller("Library.Home.User.UserController", [
                UserController
            ]);
        })(User = Home.User || (Home.User = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));