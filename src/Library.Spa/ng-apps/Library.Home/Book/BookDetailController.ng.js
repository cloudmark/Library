/// <reference path="..\..\Library.Home.Book.ng.ts" />
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
                        Description: ""
                    };
                    this.$scope = $scope;
                    this.$routeParams = $routeParams;
                    this.bookApi = bookApi;
                    this.book.Id = $routeParams.bookId;
                    this.getBook(this.book.Id);
                }
                BookDetailController.prototype.getBook = function (bookId) {
                    var _this = this;
                    this.bookApi.getBook(bookId).then(function (book) {
                        _this.book.Id = book.Id;
                        _this.book.Name = book.Name;
                        _this.book.Description = book.Description;
                    });
                };
                BookDetailController.prototype.updateBook = function () {
                    // TODO: Implement this.  
                };
                return BookDetailController;
            })();
            angular.module("Library.Home.Book").controller("Library.Home.Book.BookDetailController", [
                "$scope",
                "Library.Services.IBookApiService",
                "$routeParams",
                BookDetailController
            ]);
        })(Book = Home.Book || (Home.Book = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
