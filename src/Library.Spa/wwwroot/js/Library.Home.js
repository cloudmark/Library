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
                var url = this._urlResolver.resolveUrl("~/api/book");
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
            BookApiService.prototype.getBook = function (bookId) {
                var url = this._urlResolver.resolveUrl("~/api/book/" + bookId);
                return this._http.get(url).then(function (result) { return result.data.Data; });
            };
            BookApiService.prototype.requestBook = function (book) {
                var url = this._urlResolver.resolveUrl("~/api/book");
                return this._http.post(url, book).then(function (result) { return result.data.Data; });
            };
            BookApiService.prototype.updateBook = function (book) {
                var url = this._urlResolver.resolveUrl("~/api/book/" + book.Id);
                this._http.put(url, book);
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
/// <reference path="..\..\Library.Services.ng.ts" />
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
                this._http.delete(url);
            };
            return LoanApiService;
        })();
        angular.module("Library.Services")
            .service("Library.Services.ILoanApiService", [
            "$cacheFactory",
            "$q",
            "$http",
            "Library.UrlResolver.IUrlResolverService",
            LoanApiService
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
/// <reference path="..\..\Library.Services.ng.ts" />
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
        angular.module("Library.Services")
            .service("Library.Services.IUserApiService", [
            "$cacheFactory",
            "$q",
            "$http",
            "Library.UrlResolver.IUrlResolverService",
            UserApiService
        ]);
    })(Services = Library.Services || (Library.Services = {}));
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
                        Description: "",
                        Loans: []
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
                    this.bookApi.requestBook(this.currentBook).then(function (book) {
                        _this.currentBook = {
                            Id: -1,
                            Name: "",
                            Description: "",
                            Loans: []
                        };
                        _this.books.push(book);
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
/// <reference path="..\..\Library.Home.Book.ng.ts" />
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Book;
        (function (Book) {
            var BookDetailController = (function () {
                function BookDetailController($scope, bookApi, $routeParams) {
                    this.book = {
                        Id: 0,
                        Name: "",
                        Description: "",
                        Loans: []
                    };
                    this.$scope = $scope;
                    this.$routeParams = $routeParams;
                    this.bookApi = bookApi;
                    this.getBook($routeParams.bookId);
                }
                BookDetailController.prototype.getBook = function (bookId) {
                    var _this = this;
                    this.bookApi.getBook(bookId).then(function (book) {
                        _this.book.Id = book.Id;
                        _this.book.Name = book.Name;
                        _this.book.Description = book.Description;
                        _this.book.Loans = book.Loans;
                    });
                };
                BookDetailController.prototype.updateBook = function () {
                    this.bookApi.updateBook(this.book);
                };
                return BookDetailController;
            })();
            angular.module("Library.Home.Book")
                .controller("Library.Home.Book.BookDetailController", [
                "$scope",
                "Library.Services.IBookApiService",
                "$routeParams",
                BookDetailController
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
                controllerAs: "ctrl",
                access: { requiresLogin: true }
            })
                .when("/book", {
                templateUrl: "ng-apps/Library.Home/Book/Book.html",
                controller: "Library.Home.Book.BookController",
                controllerAs: "ctrl",
                access: { requiresLogin: true }
            })
                .when("/book/:bookId", {
                templateUrl: "ng-apps/Library.Home/Book/BookDetail.html",
                controller: "Library.Home.Book.BookDetailController",
                controllerAs: "ctrl",
                access: { requiresLogin: true }
            })
                .when("/loan", {
                templateUrl: "ng-apps/Library.Home/Loan/Loan.html",
                controller: "Library.Home.Loan.LoanController",
                controllerAs: "ctrl",
                access: { requiresLogin: true }
            })
                .when("/user", {
                templateUrl: "ng-apps/Library.Home/User/User.html",
                controller: "Library.Home.User.UserController",
                controllerAs: "ctrl",
                access: { requiresLogin: true }
            }).when("/user/:userId", {
                templateUrl: "ng-apps/Library.Home/User/UserDetail.html",
                controller: "Library.Home.User.UserDetailController",
                controllerAs: "ctrl",
                access: { requiresLogin: true }
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
                function LoanController($scope, loanApi, userApi, bookApi) {
                    this.loans = [];
                    this.users = [];
                    this.books = [];
                    this.filters = {
                        Id: "",
                        BookName: "",
                        UserName: "",
                        UserSurname: "",
                        LoanStart: null,
                        LoanEnd: null
                    };
                    this.currentLoan = {
                        BookId: (this.books.length > 0) ? this.books[0].Id : -1,
                        UserId: (this.users.length > 0) ? this.users[0].Id : -1,
                        Days: 7
                    };
                    this.$scope = $scope;
                    this.userApi = userApi;
                    this.loanApi = loanApi;
                    this.bookApi = bookApi;
                    this.refreshLoans();
                    this.refreshUsers();
                    this.refreshBooks();
                }
                LoanController.prototype.refreshLoans = function () {
                    var _this = this;
                    this.loanApi.getLoans().then(function (loans) {
                        _this.loans.length = 0;
                        _this.loans.push.apply(_this.loans, loans);
                    });
                };
                LoanController.prototype.refreshUsers = function () {
                    var _this = this;
                    this.userApi.getUsers().then(function (users) {
                        _this.users.length = 0;
                        if (users.length > 0)
                            _this.currentLoan.UserId = users[0].Id;
                        _this.users.push.apply(_this.users, users);
                    });
                };
                LoanController.prototype.refreshBooks = function () {
                    var _this = this;
                    this.bookApi.getBooks().then(function (books) {
                        _this.books.length = 0;
                        if (books.length > 0)
                            _this.currentLoan.BookId = books[0].Id;
                        _this.books.push.apply(_this.books, books);
                    });
                };
                LoanController.prototype.clearFilters = function () {
                    this.filters.Id = "";
                    this.filters.BookName = "";
                    this.filters.UserName = "";
                    this.filters.UserSurname = "";
                    this.filters.LoanStart = null;
                    this.filters.LoanEnd = null;
                };
                LoanController.prototype.addLoan = function () {
                    var _this = this;
                    this.loanApi.addLoan(this.currentLoan).then(function (loan) {
                        _this.currentLoan = {
                            BookId: (_this.books.length > 0) ? _this.books[0].Id : -1,
                            UserId: (_this.users.length > 0) ? _this.users[0].Id : -1,
                            Days: 7
                        };
                        _this.loans.push(loan);
                    });
                };
                LoanController.prototype.endLoan = function (loanId) {
                    this.loanApi.endLoan(loanId);
                    this.refreshLoans();
                };
                return LoanController;
            })();
            angular.module("Library.Home.Loan")
                .controller("Library.Home.Loan.LoanController", [
                "$scope",
                "Library.Services.ILoanApiService",
                "Library.Services.IUserApiService",
                "Library.Services.IBookApiService",
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
                function UserController($scope, userApi) {
                    this.users = [];
                    this.filters = {
                        Id: "",
                        Name: "",
                        Surname: ""
                    };
                    this.currentUser = {
                        Id: -1,
                        Name: "",
                        Surname: "",
                        Loans: []
                    };
                    this.$scope = $scope;
                    this.userApi = userApi;
                    this.refreshUsers();
                }
                UserController.prototype.refreshUsers = function () {
                    var _this = this;
                    this.userApi.getUsers().then(function (users) {
                        _this.users.length = 0;
                        _this.users.push.apply(_this.users, users);
                    });
                };
                UserController.prototype.clearFilters = function () {
                    this.filters.Id = "";
                    this.filters.Name = "";
                    this.filters.Surname = "";
                };
                UserController.prototype.addUsers = function () {
                    var _this = this;
                    this.userApi.addUser(this.currentUser).then(function (user) {
                        _this.currentUser = {
                            Id: -1,
                            Name: "",
                            Surname: "",
                            Loans: []
                        };
                        _this.users.push(user);
                    });
                };
                return UserController;
            })();
            angular.module("Library.Home.User")
                .controller("Library.Home.User.UserController", [
                "$scope",
                "Library.Services.IUserApiService",
                UserController
            ]);
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
            var UserDetailController = (function () {
                function UserDetailController($scope, userApi, $routeParams) {
                    this.user = {
                        Id: 0,
                        Name: "",
                        Surname: "",
                        Loans: []
                    };
                    this.$scope = $scope;
                    this.userApi = userApi;
                    this.getUser($routeParams.userId);
                }
                UserDetailController.prototype.getUser = function (userId) {
                    var _this = this;
                    this.userApi.getUser(userId).then(function (user) {
                        _this.user.Id = user.Id;
                        _this.user.Name = user.Name;
                        _this.user.Surname = user.Surname;
                        _this.user.Loans = user.Loans;
                    });
                };
                UserDetailController.prototype.updateUser = function () {
                    this.userApi.updateUser(this.user);
                };
                return UserDetailController;
            })();
            angular.module("Library.Home.User")
                .controller("Library.Home.User.UserDetailController", [
                "$scope",
                "Library.Services.IUserApiService",
                "$routeParams",
                UserDetailController
            ]);
        })(User = Home.User || (Home.User = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
