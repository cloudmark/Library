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
        })(User = Home.User || (Home.User = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
