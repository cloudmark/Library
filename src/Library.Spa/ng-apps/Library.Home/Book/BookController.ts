module Library.Home.Book {
    interface IHomeViewModel {
        books: Array<Models.IBook>
    }

    class HomeController implements IHomeViewModel {
        public books: Array<Models.IBook>;

        constructor(bookApi: Services.IBookApiService) {
            var viewModel = this;

            bookApi.getBooks().then(books => {
                viewModel.books = books;
            });
        }
    }
}