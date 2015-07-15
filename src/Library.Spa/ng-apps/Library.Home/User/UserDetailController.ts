module Library.Home.User {

    interface IUserDetailViewModel {
        user: Models.IUser; 
        getUser(userId: number): void; 
        updateUser(): void;
    }

    interface IUserParams extends ng.route.IRouteParamsService {
        userId: number;
    }

    class UserDetailController implements IUserDetailViewModel {
        private $scope: ng.IScope; 
        private userApi: Services.IUserApiService; 
        user: Models.IUser = {
            Id: 0,
            Name: "",
            Surname: "",
            Loans: []
        };
       
        constructor($scope: ng.IScope, userApi: Services.IUserApiService, $routeParams: IUserParams) {
            this.$scope = $scope; 
            this.userApi = userApi;
            this.getUser($routeParams.userId);
        }

        getUser(userId : number): void {
            this.userApi.getUser(userId).then(user => {
                this.user.Id = user.Id;
                this.user.Name = user.Name;
                this.user.Surname = user.Surname;
                this.user.Loans = user.Loans;
            });
        }

   
        updateUser(): void {
            // TODO: Implement this.  
        }
    
    }
}