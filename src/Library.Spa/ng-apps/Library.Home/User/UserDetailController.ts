module Library.Home.User {

    interface IUserDetailViewModel {
        user: Models.IUser; 
        getUser(): void; 
        updateUser(): void;
    }

    class UserDetailController implements IUserDetailViewModel {
        private $scope: ng.IScope; 
        private userApi: Services.IUserApiService; 
        public user:  Models.IUser; 
       
        constructor($scope: ng.IScope, userApi: Services.IUserApiService, $routeParams: ng.route.IRouteParamsService) {
            this.$scope = $scope; 
            this.userApi = userApi;
            this.getUser();
        }

        getUser(): void {
             // TODO: Implement this.
        }

   
        updateUser(): void {
            // TODO: Implement this.  
        }
    
    }
}