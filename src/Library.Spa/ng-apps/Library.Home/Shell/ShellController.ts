module Library.Home.Shell {

    interface IShellController{
        currentUser: Models.ILogin; 
        login(username: string, password: string): void;
        logout(): void;
    }

    class ShellController implements IShellController {
        private authApi: AuthApi.ILoginApiService;
        private location: ng.ILocationService; 

        currentUser: Models.ILogin; 
        constructor($location: ng.ILocationService, authApi: AuthApi.ILoginApiService) {
            this.authApi = authApi;
            this.currentUser = this.authApi.currentUser;
            this.location = $location; 
        }


        login(username: string, password: string): void {
            this.authApi.login(username, password).then(u => {
                this.location.path("/");
            });
        }

        logout(): void {
            this.authApi.logout();
            this.location.path("/login");
        }       
    }
}

