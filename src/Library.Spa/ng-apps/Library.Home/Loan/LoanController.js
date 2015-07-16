var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Loan;
        (function (Loan) {
            var LoanController = (function () {
                function LoanController($scope, loanApi, userApi, bookApi) {
                    this.now = new Date();
                    this.loans = [];
                    this.users = [];
                    this.books = [];
                    this.filters = {
                        Id: "",
                        BookName: "",
                        UserName: "",
                        UserSurname: "",
                        LoanStart: null,
                        LoanEnd: null
                    };
                    this.currentLoan = {
                        BookId: (this.books.length > 0) ? this.books[0].Id : -1,
                        UserId: (this.users.length > 0) ? this.users[0].Id : -1,
                        Days: 7
                    };
                    this.$scope = $scope;
                    this.userApi = userApi;
                    this.loanApi = loanApi;
                    this.bookApi = bookApi;
                    this.refreshLoans();
                    this.refreshUsers();
                    this.refreshBooks();
                }
                LoanController.prototype.refreshLoans = function () {
                    var _this = this;
                    this.loanApi.getLoans().then(function (loans) {
                        _this.loans.length = 0;
                        loans.forEach(function (l) {
                            l.LoanEnd = new Date(l.LoanEnd);
                            l.LoanStart = new Date(l.LoanStart);
                            _this.loans.push(l);
                        });
                    });
                };
                LoanController.prototype.refreshUsers = function () {
                    var _this = this;
                    this.userApi.getUsers().then(function (users) {
                        _this.users.length = 0;
                        if (users.length > 0)
                            _this.currentLoan.UserId = users[0].Id;
                        _this.users.push.apply(_this.users, users);
                    });
                };
                LoanController.prototype.refreshBooks = function () {
                    var _this = this;
                    this.bookApi.getBooks().then(function (books) {
                        _this.books.length = 0;
                        if (books.length > 0)
                            _this.currentLoan.BookId = books[0].Id;
                        _this.books.push.apply(_this.books, books);
                    });
                };
                LoanController.prototype.clearFilters = function () {
                    this.filters.Id = "";
                    this.filters.BookName = "";
                    this.filters.UserName = "";
                    this.filters.UserSurname = "";
                    this.filters.LoanStart = null;
                    this.filters.LoanEnd = null;
                };
                LoanController.prototype.addLoan = function () {
                    var _this = this;
                    this.loanApi.addLoan(this.currentLoan).then(function (loan) {
                        _this.currentLoan = {
                            BookId: (_this.books.length > 0) ? _this.books[0].Id : -1,
                            UserId: (_this.users.length > 0) ? _this.users[0].Id : -1,
                            Days: 7
                        };
                        _this.loans.push(loan);
                    });
                };
                LoanController.prototype.endLoan = function (loanId) {
                    var _this = this;
                    this.loanApi.endLoan(loanId).then(function () {
                        _this.now = new Date();
                        _this.refreshLoans();
                    });
                };
                LoanController.prototype.isPast = function (endDate) {
                    return endDate < this.now;
                };
                return LoanController;
            })();
        })(Loan = Home.Loan || (Home.Loan = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
