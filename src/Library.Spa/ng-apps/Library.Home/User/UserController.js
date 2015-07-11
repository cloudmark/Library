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
        })(User = Home.User || (Home.User = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
