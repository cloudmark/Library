module Library.Home.Loan {

    interface ILoanViewModel {
        loans: Array<Models.ILoan>;
        users: Array<Models.IUser>;
        books: Array<Models.IBook>;
        
        refreshLoans(): void
        clearFilters(): void;
        addLoan(): void;
    }

    class LoanController implements ILoanViewModel {
        private $scope: ng.IScope;
        private userApi: Services.IUserApiService;
        private bookApi: Services.IBookApiService; 
        private loanApi: Services.ILoanApiService; 


        public loans: Array<Models.ILoan> = [];
        public users: Array<Models.IUser> = []; 
        public books: Array<Models.IBook> = []; 

        public filters = {
            Id: "",
            BookName: "",
            UserName: "", 
            UserSurname: "", 
            LoanStart: null, 
            LoanEnd: null
        }
        public currentLoan: Models.ILoanTrimmed = {
            BookId: (this.books.length > 0) ? this.books[0].Id : -1,
            UserId: (this.users.length > 0) ? this.users[0].Id : -1,
            Days: 7
        };

        constructor($scope: ng.IScope,
                    loanApi: Services.ILoanApiService, 
                    userApi: Services.IUserApiService,
                    bookApi: Services.IBookApiService) {
            this.$scope = $scope;
            this.userApi = userApi;
            this.loanApi = loanApi;
            this.bookApi = bookApi; 

            this.refreshLoans();
            this.refreshUsers();
            this.refreshBooks();
        }

        refreshLoans(): void {
            this.loanApi.getLoans().then(loans => {
                this.loans.length = 0;
                this.loans.push.apply(this.loans, loans);
            });
        }

        refreshUsers(): void {
            this.userApi.getUsers().then(users => {
                this.users.length = 0;
                if (users.length > 0) this.currentLoan.UserId = users[0].Id; 
                this.users.push.apply(this.users, users);
            });
        }

        refreshBooks(): void {
            this.bookApi.getBooks().then(books => {
                this.books.length = 0;
                if (books.length > 0) this.currentLoan.BookId = books[0].Id; 
                this.books.push.apply(this.books, books);
            });
        }

        clearFilters(): void {
            this.filters.Id = "";
            this.filters.BookName = "";
            this.filters.UserName = "";
            this.filters.UserSurname = "";
            this.filters.LoanStart = null;
            this.filters.LoanEnd = null;
        }

        addLoan(): void {
            this.loanApi.addLoan(this.currentLoan).then(loan => {
                this.currentLoan = {
                    BookId: (this.books.length > 0) ? this.books[0].Id : -1,
                    UserId: (this.users.length > 0)? this.users[0].Id: -1,
                    Days: 7
                };

                this.loans.push(loan);
            });
        }

    }
}