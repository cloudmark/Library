var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Book;
        (function (Book) {
            var BookController = (function () {
                function BookController($scope, bookApi) {
                    this.books = [];
                    this.filters = {
                        Id: "",
                        Name: "",
                        Description: ""
                    };
                    this.currentBook = {
                        Id: -1,
                        Name: "",
                        Description: ""
                    };
                    this.$scope = $scope;
                    this.bookApi = bookApi;
                    this.refreshBooks();
                }
                BookController.prototype.refreshBooks = function () {
                    var _this = this;
                    this.bookApi.getBooks().then(function (books) {
                        _this.books.length = 0;
                        _this.books.push.apply(_this.books, books);
                    });
                };
                BookController.prototype.clearFilters = function () {
                    this.filters.Id = "";
                    this.filters.Name = "";
                    this.filters.Description = "";
                };
                BookController.prototype.requestBook = function () {
                    var _this = this;
                    debugger;
                    this.bookApi.requestBook(this.currentBook).then(function (book) {
                        _this.currentBook = {
                            Id: -1,
                            Name: "",
                            Description: ""
                        };
                        _this.books.push.apply(_this.books, [book]);
                    });
                };
                return BookController;
            })();
        })(Book = Home.Book || (Home.Book = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
