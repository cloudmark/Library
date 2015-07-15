module Library.Home.Book {

    interface IBookViewModel {
        books: Array<Models.IBook>; 
        refreshBooks(): void; 
        clearFilters(): void;
        requestBook(): void;
    }

    class BookController implements IBookViewModel {
        private $scope: ng.IScope; 
        private bookApi: Services.IBookApiService; 
        public books: Array<Models.IBook> = [];
        public filters = {
            Id: "",
            Name: "", 
            Description: ""
        }
        public currentBook: Models.IBook = {
            Id: -1,
            Name: "",
            Description: "",
            Loans: []
        };

        constructor($scope: ng.IScope, bookApi: Services.IBookApiService) {
            this.$scope = $scope; 
            this.bookApi = bookApi;
            this.refreshBooks();
        }

        refreshBooks(): void {
            this.bookApi.getBooks().then(books => {
                this.books.length = 0;
                this.books.push.apply(this.books, books);
            });
        }

        clearFilters(): void {
            this.filters.Id = "";
            this.filters.Name = "";
            this.filters.Description = ""; 
        }
        
        requestBook(): void {
            this.bookApi.requestBook(this.currentBook).then(book => {
                this.currentBook = {
                    Id: -1,
                    Name: "",
                    Description: "",
                    Loans: []
                };
                this.books.push(book);
            });
        }
    
    }
}