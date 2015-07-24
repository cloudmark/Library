module Library.Home.Book {

    interface IBookDetailViewModel {
        book: Models.IBook; 
        getBook(bookId: number): void; 
        updateBook(): void;
    }

    interface IBookParams extends ng.route.IRouteParamsService {
        bookId : number;
    }

    class BookDetailController implements IBookDetailViewModel  {
        private $scope: ng.IScope; 
        private bookApi: BookApi.IBookApiService; 
        book: Models.IBook = {
            Id: 0,
            Name: "",
            Description: "",
            Loans: []
        };
        private $routeParams: ng.route.IRouteParamsService; 
       
        constructor($scope: ng.IScope, bookApi: BookApi.IBookApiService, $routeParams: IBookParams) {
            this.$scope = $scope;
            this.$routeParams = $routeParams; 
            this.bookApi = bookApi;
            this.getBook($routeParams.bookId);
        }

        getBook(bookId : number): void {
            this.bookApi.getBook(bookId).then(book => {
                this.book.Id = book.Id;
                this.book.Name = book.Name;
                this.book.Description = book.Description;
                this.book.Loans = book.Loans;
            });
        }
   
        updateBook(): void {
            this.bookApi.updateBook(this.book);
        }
    }
}