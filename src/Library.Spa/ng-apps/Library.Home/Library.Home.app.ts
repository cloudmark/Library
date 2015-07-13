/// <reference path="../references.ts" />
module Library.Home {
	var dependencies = [
		"ngRoute",
        Library.UrlResolver,
        Library.Services
	];

	// Use this method to register work which needs to be performed on module loading.
    // Note only providers can be injected as dependencies here.
    function configuration($routeProvider: ng.route.IRouteProvider, $logProvider: ng.ILogProvider) {
        // TODO: Enable debug logging based on server config
        // TODO: Capture all logged errors and send back to server
        $logProvider.debugEnabled(true);

        $routeProvider
            .when("/", { templateUrl: "ng-apps/MusicStore.Store/Home/Home.html" })
            .otherwise({ redirectTo: "/" });
    }

    // Use this method to register work which should be performed when the injector is done loading all modules.
    function run($log: ng.ILogService, bookService: Services.IBookApiService) {
        $log.log("Loaded Everything");
    }
}