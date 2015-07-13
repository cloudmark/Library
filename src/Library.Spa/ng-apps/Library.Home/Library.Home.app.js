/// <reference path="../references.ts" />
var Library;
(function (Library) {
    var Home;
    (function (Home) {
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
            $routeProvider.when("/", { templateUrl: "ng-apps/Library.Home/Home/Home.html" }).when("/book", { templateUrl: "ng-apps/Library.Home/Book/Book.html" }).when("/loan", { templateUrl: "ng-apps/Library.Home/Loan/Loan.html" }).when("/user", { templateUrl: "ng-apps/Library.Home/User/User.html" }).otherwise({ redirectTo: "/" });
        }
        // Use this method to register work which should be performed when the injector is done loading all modules.
        function run($log, bookService) {
            $log.log("Loaded Everything");
        }
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
