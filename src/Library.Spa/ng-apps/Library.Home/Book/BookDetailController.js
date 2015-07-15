var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Book;
        (function (Book) {
            var BookDetailController = (function () {
                function BookDetailController($scope, bookApi, $routeParams) {
                    this.book = {
                        Id: 0,
                        Name: "",
                        Description: "",
                        Loans: []
                    };
                    this.$scope = $scope;
                    this.$routeParams = $routeParams;
                    this.bookApi = bookApi;
                    debugger;
                    this.getBook($routeParams.bookId);
                }
                BookDetailController.prototype.getBook = function (bookId) {
                    var _this = this;
                    this.bookApi.getBook(bookId).then(function (book) {
                        _this.book.Id = book.Id;
                        _this.book.Name = book.Name;
                        _this.book.Description = book.Description;
                        _this.book.Loans = book.Loans;
                    });
                };
                BookDetailController.prototype.updateBook = function () {
                    // TODO: Implement this.  
                };
                return BookDetailController;
            })();
        })(Book = Home.Book || (Home.Book = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
