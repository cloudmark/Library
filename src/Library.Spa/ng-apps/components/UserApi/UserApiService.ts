/// <reference path="../../references.ts" /> 

module Library.Services {
	export interface IUserApiService {
        getUsers(page?: number, pageSize?: number, sortBy?: string): ng.IPromise<Array<Models.IUser>>;
        addUser(user: Models.IUser): ng.IPromise<Models.IUser>;
        getUser(userId: number): ng.IPromise<Models.IUser>;
        updateUser(user: Models.IUser): void;
	}

    class UserApiService implements IUserApiService {
		private _inlineData: ng.ICacheObject;
        private _q: ng.IQService;
        private _http: ng.IHttpService;
        private _urlResolver: UrlResolver.IUrlResolverService;

        constructor($cacheFactory: ng.ICacheFactoryService,
            $q: ng.IQService,
            $http: ng.IHttpService,
            urlResolver: UrlResolver.IUrlResolverService) {
            this._inlineData = $cacheFactory.get("inlineData");
            this._q = $q;
            this._http = $http;
            this._urlResolver = urlResolver;
        }

        public getUsers(page?: number, pageSize?: number, sortBy?: string): ng.IPromise<Array<Models.IUser>> {
            var url = this._urlResolver.resolveUrl("~/api/user");
            var query: any = {};
            var querySeparator = "?";
            if (page) {
                query.page = page;
            }

            if (pageSize) {
                query.pageSize = pageSize;
            }

            if (sortBy) {
                query.sortBy = sortBy;
            }

            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    url += querySeparator + key + "=" + encodeURIComponent(query[key]);
                    if (querySeparator === "?") {
                        querySeparator = "&";
                    }
                }
            }

            var inlineData = this._inlineData ? this._inlineData.get(url) : null;

            if (inlineData) {
                return this._q.when(inlineData);
            } else {
                return this._http.get(url).then(result => result.data.Data); 
            }
        }

        public getUser(userId: number): ng.IPromise<Models.IUser> {
            var url = this._urlResolver.resolveUrl("~/api/user/" + userId);
            return this._http.get(url).then(result => result.data.Data);
        }

        public addUser(book: Models.IUser): ng.IPromise<Models.IUser> {
            var url = this._urlResolver.resolveUrl("~/api/user");
            return this._http.post(url, book).then(result => result.data.Data);    
        }

        public updateUser(user: Models.IUser): void {
            var url = this._urlResolver.resolveUrl("~/api/user/" + user.Id);
            this._http.put(url, user);
        }
	}
}