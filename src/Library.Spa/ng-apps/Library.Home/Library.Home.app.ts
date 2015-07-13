/// <reference path="../references.ts" />
module Library.Home {
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
    function configuration($routeProvider: ng.route.IRouteProvider, $logProvider: ng.ILogProvider) {
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
    function run($log: ng.ILogService, bookService: Services.IBookApiService) {
        $('#menu-toggle').click((e) => {
            e.preventDefault();
            $('#wrapper').toggleClass('toggled');
        });
    }
}