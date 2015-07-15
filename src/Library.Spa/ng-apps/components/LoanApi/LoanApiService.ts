/// <reference path="../../references.ts" /> 

module Library.Services {
	export interface ILoanApiService {
        getLoans(page?: number, pageSize?: number, sortBy?: string): ng.IPromise<Array<Models.ILoan>>;
        addLoan(book: Models.ILoanTrimmed): ng.IPromise<Models.ILoan>;
        endLoan(loan: number): void;
	}

    class LoanApiService implements ILoanApiService {
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

        public getLoans(page?: number, pageSize?: number, sortBy?: string): ng.IPromise<Array<Models.ILoan>> {
            var url = this._urlResolver.resolveUrl("~/api/loan");
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

        public addLoan(book: Models.ILoanTrimmed): ng.IPromise<Models.ILoan> {
            var url = this._urlResolver.resolveUrl("~/api/loan");
            return this._http.post(url, book).then(result => result.data.Data);    
        }

        public endLoan(loanId: number): void {
            var url = this._urlResolver.resolveUrl("~/api/loan/" + loanId);
            this._http.delete(url);
        }
	}
}