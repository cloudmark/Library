var Library;
(function (Library) {
    var AuthApi;
    (function (AuthApi) {
        angular.module("Library.AuthApi", []);
    })(AuthApi = Library.AuthApi || (Library.AuthApi = {}));
})(Library || (Library = {}));
/// <reference path="../bower_components/dt-angular/angular.d.ts" /> 
/// <reference path="../bower_components/dt-angular/angular-route.d.ts" />
/// <reference path="../bower_components/dt-angular-ui-bootstrap/angular-ui-bootstrap.d.ts" /> 
/// <reference path="../definitions/dt-es6-promise.d.ts" />
/// <reference path="..\..\Library.AuthApi.ng.ts" />
/// <reference path="../../references.ts" /> 
var Library;
(function (Library) {
    var AuthApi;
    (function (AuthApi) {
        var LoginApiService = (function () {
            function LoginApiService($cacheFactory, $q, $http, urlResolver, base64) {
                this.currentUser = {
                    ClientId: "IdentityWebUI",
                    Secret: "secret",
                    Username: "testUser",
                    Password: "testPwd",
                    Token: "",
                    IsLoggedIn: false
                };
                this._base64 = base64;
                this._inlineData = $cacheFactory.get("inlineData");
                this._q = $q;
                this._http = $http;
                this._urlResolver = urlResolver;
                this.auth = this._base64.encode(this.currentUser.ClientId + ":" + this.currentUser.Secret);
            }
            LoginApiService.prototype.login = function (username, password) {
                var _this = this;
                this.currentUser.Username = username;
                this.currentUser.Password = password;
                this._http.defaults.headers.common['Authorization'] = 'Basic ' + this.auth;
                var params = {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                };
                var url = this._urlResolver.resolveUrl("~/core/connect/token");
                return this._http.post(url, $.param({
                    "grant_type": "password",
                    "username": this.currentUser.Username,
                    "password": this.currentUser.Password,
                    "scope": "openid"
                }), params).then(function (result) {
                    _this.currentUser.Token = result.data["access_token"];
                    _this.currentUser.IsLoggedIn = true;
                    return _this.currentUser;
                });
            };
            LoginApiService.prototype.logout = function () {
                this.currentUser.IsLoggedIn = false;
                this.currentUser.Username = "",
                    this.currentUser.Password = "",
                    this.currentUser.Token = null;
            };
            LoginApiService.prototype.isLoggedIn = function (error) {
                var _this = this;
                if (this.currentUser.Token && this.currentUser.Token !== "") {
                    var url = this._urlResolver.resolveUrl("~/core/connect/userinfo/");
                    this._http.defaults.headers.common['Authorization'] = 'Bearer ' + this.currentUser.Token;
                    return this._http.get(url).error(function () {
                        _this.logout();
                        if (error)
                            error();
                    }).success(function (result) {
                        return _this.currentUser;
                    });
                }
                else {
                    var defer = this._q.defer();
                    defer.reject(this.currentUser);
                    return defer.promise;
                }
            };
            return LoginApiService;
        })();
        angular.module("Library.AuthApi")
            .service("Library.AuthApi.ILoginApiService", [
            "$cacheFactory",
            "$q",
            "$http",
            "Library.UrlResolver.IUrlResolverService",
            "Library.Base64.IBase64Service",
            LoginApiService
        ]);
    })(AuthApi = Library.AuthApi || (Library.AuthApi = {}));
})(Library || (Library = {}));
var Library;
(function (Library) {
    var Base64;
    (function (Base64) {
        angular.module("Library.Base64", []);
    })(Base64 = Library.Base64 || (Library.Base64 = {}));
})(Library || (Library = {}));
/// <reference path="..\..\Library.Base64.ng.ts" />
var Library;
(function (Library) {
    var Base64;
    (function (Base64) {
        var Base64Service = (function () {
            function Base64Service() {
                this.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            }
            Base64Service.prototype.encode = function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    }
                    else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output +
                        this.keyStr.charAt(enc1) +
                        this.keyStr.charAt(enc2) +
                        this.keyStr.charAt(enc3) +
                        this.keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);
                return output;
            };
            Base64Service.prototype.decode = function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                do {
                    enc1 = this.keyStr.indexOf(input.charAt(i++));
                    enc2 = this.keyStr.indexOf(input.charAt(i++));
                    enc3 = this.keyStr.indexOf(input.charAt(i++));
                    enc4 = this.keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);
                return output;
            };
            return Base64Service;
        })();
        angular.module("Library.Base64")
            .service("Library.Base64.IBase64Service", [
            Base64Service
        ]);
    })(Base64 = Library.Base64 || (Library.Base64 = {}));
})(Library || (Library = {}));
var Library;
(function (Library) {
    var BookApi;
    (function (BookApi) {
        angular.module("Library.BookApi", []);
    })(BookApi = Library.BookApi || (Library.BookApi = {}));
})(Library || (Library = {}));
/// <reference path="..\..\Library.BookApi.ng.ts" />
/// <reference path="../../references.ts" /> 
var Library;
(function (Library) {
    var BookApi;
    (function (BookApi) {
        var BookApiService = (function () {
            function BookApiService($cacheFactory, $q, $http, urlResolver, authApi) {
                this._inlineData = $cacheFactory.get("inlineData");
                this._q = $q;
                this._http = $http;
                this._urlResolver = urlResolver;
                this.authApi = authApi;
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
                this._http.defaults.headers.common['Authorization'] = 'Bearer ' + this.authApi.currentUser.Token;
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
        angular.module("Library.BookApi")
            .service("Library.BookApi.IBookApiService", [
            "$cacheFactory",
            "$q",
            "$http",
            "Library.UrlResolver.IUrlResolverService",
            "Library.AuthApi.ILoginApiService",
            BookApiService
        ]);
    })(BookApi = Library.BookApi || (Library.BookApi = {}));
})(Library || (Library = {}));
var Library;
(function (Library) {
    var LoanApi;
    (function (LoanApi) {
        angular.module("Library.LoanApi", []);
    })(LoanApi = Library.LoanApi || (Library.LoanApi = {}));
})(Library || (Library = {}));
/// <reference path="..\..\Library.LoanApi.ng.ts" />
/// <reference path="../../references.ts" /> 
var Library;
(function (Library) {
    var LoanApi;
    (function (LoanApi) {
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
        angular.module("Library.LoanApi")
            .service("Library.LoanApi.ILoanApiService", [
            "$cacheFactory",
            "$q",
            "$http",
            "Library.UrlResolver.IUrlResolverService",
            LoanApiService
        ]);
    })(LoanApi = Library.LoanApi || (Library.LoanApi = {}));
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
    var UserApi;
    (function (UserApi) {
        angular.module("Library.UserApi", []);
    })(UserApi = Library.UserApi || (Library.UserApi = {}));
})(Library || (Library = {}));
/// <reference path="..\..\Library.UserApi.ng.ts" />
/// <reference path="../../references.ts" /> 
var Library;
(function (Library) {
    var UserApi;
    (function (UserApi) {
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
        angular.module("Library.UserApi")
            .service("Library.UserApi.IUserApiService", [
            "$cacheFactory",
            "$q",
            "$http",
            "Library.UrlResolver.IUrlResolverService",
            UserApiService
        ]);
    })(UserApi = Library.UserApi || (Library.UserApi = {}));
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
                "Library.BookApi.IBookApiService",
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
                "Library.BookApi.IBookApiService",
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
            "Library.Base64",
            "Library.UrlResolver",
            "Library.AuthApi",
            "Library.BookApi",
            "Library.LoanApi",
            "Library.UserApi",
            "Library.Home.Shell",
            "Library.Home.Login",
            "Library.Home.Home",
            "Library.Home.User",
            "Library.Home.Loan",
            "Library.Home.Book",
        ]).config([
            "$routeProvider",
            "$logProvider",
            configuration
        ]).run([
            "$rootScope",
            "$location",
            "$log",
            "Library.AuthApi.ILoginApiService",
            run
        ]);
        var dependencies = [
            "ngRoute",
            Library.Base64,
            Library.UrlResolver,
            Library.AuthApi,
            Library.BookApi,
            Library.LoanApi,
            Library.UserApi,
            Library.Home.Shell,
            Library.Home.Login,
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
                .when("/login", {
                templateUrl: "ng-apps/Library.Home/Login/Login.html",
                controller: "Library.Home.Login.LoginController",
                controllerAs: "ctrl",
                access: { requiresLogin: false }
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
        function run($rootScope, $location, $log, authService) {
            $('#menu-toggle').click(function (e) {
                e.preventDefault();
                $('#wrapper').toggleClass('toggled');
            });
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next.$$route.access && next.$$route.access.requiresLogin) {
                    authService.isLoggedIn(function () {
                        $location.path("/login");
                    }).then(function () {
                        return;
                    }, function () {
                        $location.path("/login");
                    });
                }
                else {
                    return;
                }
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
                    this.now = new Date();
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
                        loans.forEach(function (l) {
                            l.LoanEnd = new Date(l.LoanEnd);
                            l.LoanStart = new Date(l.LoanStart);
                            _this.loans.push(l);
                        });
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
                    var _this = this;
                    this.loanApi.endLoan(loanId).then(function () {
                        _this.now = new Date();
                        _this.refreshLoans();
                    });
                };
                LoanController.prototype.isPast = function (endDate) {
                    return endDate < this.now;
                };
                return LoanController;
            })();
            angular.module("Library.Home.Loan")
                .controller("Library.Home.Loan.LoanController", [
                "$scope",
                "Library.LoanApi.ILoanApiService",
                "Library.UserApi.IUserApiService",
                "Library.BookApi.IBookApiService",
                LoanController
            ]);
        })(Loan = Home.Loan || (Home.Loan = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Login;
        (function (Login) {
            angular.module("Library.Home.Login", []);
        })(Login = Home.Login || (Home.Login = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
/// <reference path="..\..\Library.Home.Login.ng.ts" />
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Login;
        (function (Login) {
            var LoginController = (function () {
                function LoginController($location, authApi) {
                    this.authApi = authApi;
                    this.currentUser = this.authApi.currentUser;
                    this.location = $location;
                }
                LoginController.prototype.login = function (username, password) {
                    var _this = this;
                    this.authApi.login(this.currentUser.Username, this.currentUser.Password).then(function (u) {
                        // Redirect 
                        _this.location.path("/");
                    });
                };
                LoginController.prototype.logout = function () {
                    this.authApi.logout();
                    // Redirect to home.
                    this.location.path("/login");
                };
                return LoginController;
            })();
            angular.module("Library.Home.Login")
                .controller("Library.Home.Login.LoginController", [
                "$location",
                "Library.AuthApi.ILoginApiService",
                LoginController
            ]);
        })(Login = Home.Login || (Home.Login = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Shell;
        (function (Shell) {
            angular.module("Library.Home.Shell", []);
        })(Shell = Home.Shell || (Home.Shell = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
/// <reference path="..\..\Library.Home.Shell.ng.ts" />
var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Shell;
        (function (Shell) {
            var ShellController = (function () {
                function ShellController($location, authApi) {
                    this.authApi = authApi;
                    this.currentUser = this.authApi.currentUser;
                    this.location = $location;
                }
                ShellController.prototype.login = function (username, password) {
                    var _this = this;
                    this.authApi.login(username, password).then(function (u) {
                        _this.location.path("/");
                    });
                };
                ShellController.prototype.logout = function () {
                    this.authApi.logout();
                    this.location.path("/login");
                };
                return ShellController;
            })();
            angular.module("Library.Home.Shell")
                .controller("Library.Home.Shell.ShellController", [
                "$location",
                "Library.AuthApi.ILoginApiService",
                ShellController
            ]);
        })(Shell = Home.Shell || (Home.Shell = {}));
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
                UserController.prototype.addUser = function () {
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
                "Library.UserApi.IUserApiService",
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
                "Library.UserApi.IUserApiService",
                "$routeParams",
                UserDetailController
            ]);
        })(User = Home.User || (Home.User = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
