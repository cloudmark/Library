module Library.Home.Book {

    interface IBookDetailViewModel {
        book: Models.IBook; 
        getBook(): void; 
        updateBook(): void;
    }

    class BookDetailController implements IBookDetailViewModel  {
        private $scope: ng.IScope; 
        private bookApi: Services.IBookApiService; 
        public book: Models.IBook; 
        private $routeParams: ng.route.IRouteParamsService; 
       
        constructor($scope: ng.IScope, bookApi: Services.IBookApiService, $routeParams: ng.route.IRouteParamsService) {
            this.$scope = $scope;
            this.$routeParams = $routeParams; 
            this.bookApi = bookApi;
            // this.getBook($routeParams.bookId);
        }

        getBook(): void {
             // TODO: Implement this.
        }

   
        updateBook(): void {
            // TODO: Implement this.  
        }
    
    }
}