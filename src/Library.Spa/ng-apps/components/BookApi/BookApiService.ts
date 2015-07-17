/// <reference path="../../references.ts" /> 

module Library.BookApi {
	export interface IBookApiService {
        getBooks(page?: number, pageSize?: number, sortBy?: string): ng.IPromise<Array<Models.IBook>>;
        getBook(bookId: number): ng.IPromise<Models.IBook>;
        requestBook(book: Models.IBook): ng.IPromise<Models.IBook>; 
        updateBook(book: Models.IBook): void;
	}

    class BookApiService implements IBookApiService {
		private _inlineData: ng.ICacheObject;
        private _q: ng.IQService;
        private _http: ng.IHttpService;
        private _urlResolver: UrlResolver.IUrlResolverService;
        private authApi: AuthApi.ILoginApiService; 

        constructor($cacheFactory: ng.ICacheFactoryService,
            $q: ng.IQService,
            $http: ng.IHttpService,
            urlResolver: UrlResolver.IUrlResolverService,
            authApi: AuthApi.ILoginApiService) {
            this._inlineData = $cacheFactory.get("inlineData");
            this._q = $q;
            this._http = $http;
            this._urlResolver = urlResolver;
            this.authApi = authApi;
        }

        public getBooks(page?: number, pageSize?: number, sortBy?: string): ng.IPromise<Array<Models.IBook>> {
            var url = this._urlResolver.resolveUrl("~/api/book");
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

        public getBook(bookId: number): ng.IPromise<Models.IBook> {
            var url = this._urlResolver.resolveUrl("~/api/book/" + bookId);
            this._http.defaults.headers.common['Authorization'] = 'Bearer ' + this.authApi.currentUser.Token;
            return this._http.get(url).then(result => result.data.Data);
        }

        public requestBook(book: Models.IBook): ng.IPromise<Models.IBook> {
            var url = this._urlResolver.resolveUrl("~/api/book");
            return this._http.post(url, book).then(result => result.data.Data);
        }

        public updateBook(book: Models.IBook): void {
            var url = this._urlResolver.resolveUrl("~/api/book/" + book.Id);
            this._http.put(url, book);
        }
	}
}