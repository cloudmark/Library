﻿module Library.Home.User {

    interface IUserViewModel {
        users: Array<Models.IUser>;
        refreshUsers(): void;
        clearFilters(): void;
        addUsers(): void;
    }

    class UserController implements IUserViewModel {
        private $scope: ng.IScope;
        private userApi: Services.IUserApiService;


        public users: Array<Models.IUser> = [];
        public filters = {
            Id: "",
            Name: "",
            Surname: ""
        }
        public currentUser: Models.IUser = {
            Id: -1,
            Name: "",
            Surname: ""
        };

        constructor($scope: ng.IScope, userApi: Services.IUserApiService) {
            this.$scope = $scope;
            this.userApi = userApi;
            this.refreshUsers();
        }

        refreshUsers(): void {
            this.userApi.getUsers().then(users => {
                this.users.length = 0;
                this.users.push.apply(this.users, users);
            });
        }

        clearFilters(): void {
            this.filters.Id = "";
            this.filters.Name = "";
            this.filters.Surname = "";
        }

        addUsers(): void {
            this.userApi.addUser(this.currentUser).then(user => {
                this.currentUser = {
                    Id: -1,
                    Name: "",
                    Surname: ""
                };
                this.users.push(user);
            });
        }

    }
}