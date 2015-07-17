/// <reference path="../references.ts" />
module Library.Home {
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
    function configuration($routeProvider: ng.route.IRouteProvider, $logProvider: ng.ILogProvider) {
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
    function run($rootScope: ng.IRootScopeService, $location: ng.ILocationService, $log: ng.ILogService, authService: AuthApi.ILoginApiService) {
        $('#menu-toggle').click((e) => {
            e.preventDefault();
            $('#wrapper').toggleClass('toggled');
        });

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (next.$$route.access && next.$$route.access.requiresLogin) {
                authService.isLoggedIn(() => {
                    $location.path("/login");
                }).then(() => {
                    return;
                },() => {
                    $location.path("/login");
                });
            } else {
                return;
            }
        });

    }
}