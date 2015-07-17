/// <reference path="../../references.ts" /> 

module Library.AuthApi {
    export interface ILoginApiService {
        currentUser: Models.ILogin;
        login(username: string, password: string): ng.IPromise<Models.ILogin>;
        logout(): void;
        isLoggedIn(error?: () => void): ng.IPromise<Models.ILogin>;
    }

    class LoginApiService implements ILoginApiService {
        private auth: string;
        private _base64: Base64.IBase64Service;
        private _inlineData: ng.ICacheObject;
        private _q: ng.IQService;
        private _http: ng.IHttpService;
        private _urlResolver: UrlResolver.IUrlResolverService;

        currentUser: Models.ILogin = {
            ClientId: "IdentityWebUI",
            Secret: "secret",
            Username: "testUser",
            Password: "testPwd",
            Token: "",
            IsLoggedIn: false
        };

        constructor($cacheFactory: ng.ICacheFactoryService,
            $q: ng.IQService,
            $http: ng.IHttpService,
            urlResolver: UrlResolver.IUrlResolverService,
            base64: Base64.IBase64Service) {
            this._base64 = base64;
            this._inlineData = $cacheFactory.get("inlineData");
            this._q = $q;
            this._http = $http;
            this._urlResolver = urlResolver;
            this.auth = this._base64.encode(this.currentUser.ClientId + ":" + this.currentUser.Secret);

        }

        login(username: string, password: string): ng.IPromise<Models.ILogin> {
            this.currentUser.Username = username;
            this.currentUser.Password = password;
            this._http.defaults.headers.common['Authorization'] = 'Basic ' + this.auth;
            var params = {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            };

            var url = this._urlResolver.resolveUrl("~/core/connect/token");
            return this._http.post(url,
                $.param({
                    "grant_type": "password",
                    "username": this.currentUser.Username,
                    "password": this.currentUser.Password,
                    "scope": "openid"
                })
                , params).then(result => {
                this.currentUser.Token = result.data["access_token"];
                this.currentUser.IsLoggedIn = true;
                return this.currentUser; 
            });
        }

        logout(): void {
            this.currentUser.IsLoggedIn = false;
            this.currentUser.Username = "", 
            this.currentUser.Password = "", 
            this.currentUser.Token = null;  
        }

        isLoggedIn(error?: () => void): ng.IPromise<Models.ILogin> {
            if (this.currentUser.Token && this.currentUser.Token !== "") {
                var url = this._urlResolver.resolveUrl("~/core/connect/userinfo/");
                this._http.defaults.headers.common['Authorization'] = 'Bearer ' + this.currentUser.Token;
                return this._http.get(url).error(() => {
                    this.logout();
                    if (error) error();
                }).success(result => {
                    return this.currentUser;
                });
            } else {
                var defer = this._q.defer<Models.ILogin>();
                defer.reject(this.currentUser);
                return defer.promise;
            }
        }
    }
}