module Library.Home.Login {

    interface ILoginViewModel{
        currentUser: Models.ILogin; 
        login(username: string, password: string): void;
        logout(): void;
    }

    class LoginController implements ILoginViewModel {
        private authApi: AuthApi.ILoginApiService;
        private location: ng.ILocationService; 
        currentUser: Models.ILogin; 
        
        constructor($location: ng.ILocationService, authApi: AuthApi.ILoginApiService) {
            this.authApi = authApi;
            this.currentUser = this.authApi.currentUser;
            this.location = $location; 
        }

        login(username: string, password: string): void {
            this.authApi.login(this.currentUser.Username, this.currentUser.Password).then(u => {
                // Redirect 
                this.location.path("/");
            });
        }

        logout(): void {
            this.authApi.logout();
            // Redirect to home.
            this.location.path("/login");
        }
 

        
    }
}

