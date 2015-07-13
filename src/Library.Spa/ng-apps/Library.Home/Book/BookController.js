var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Book;
        (function (Book) {
            var HomeController = (function () {
                function HomeController(bookApi) {
                    var viewModel = this;
                    bookApi.getBooks().then(function (books) {
                        viewModel.books = books;
                    });
                }
                return HomeController;
            })();
        })(Book = Home.Book || (Home.Book = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
