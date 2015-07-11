/// <reference path="../../references.ts" /> 

module Library.Services {
	export interface IBookApiService {
        getBooks(page?: number, pageSize?: number, sortBy?: string): ng.IPromise<Array<Models.IBook>>;
        requestBook(book: Models.IBook): ng.IPromise<Models.IBook>; 
	}

    class BookApiService implements IBookApiService {
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

        public getBooks(page?: number, pageSize?: number, sortBy?: string): ng.IPromise<Array<Models.IBook>> {
            var url = this._urlResolver.resolveUrl("~/api/books");
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

        public requestBook(book: Models.IBook): ng.IPromise<Models.IBook> {
            var url = this._urlResolver.resolveUrl("~/api/books");
            return this._http.post(url, book).then(result => result.data.Data);    
        }
	}
}