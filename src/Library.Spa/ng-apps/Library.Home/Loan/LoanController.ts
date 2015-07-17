module Library.Home.Loan {

    interface ILoanViewModel {
        loans: Array<Models.ILoan>;
        users: Array<Models.IUser>;
        books: Array<Models.IBook>;
        
        refreshLoans(): void;
        clearFilters(): void;
        addLoan(): void;
    }

    class LoanController implements ILoanViewModel {
        private $scope: ng.IScope;
        private userApi: UserApi.IUserApiService;
        private bookApi: BookApi.IBookApiService; 
        private loanApi: LoanApi.ILoanApiService; 
        private now: Date = new Date();

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
                    loanApi: LoanApi.ILoanApiService, 
                    userApi: UserApi.IUserApiService,
                    bookApi: BookApi.IBookApiService) {
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
                loans.forEach(l => {
                    l.LoanEnd = new Date(<string><any>l.LoanEnd);
                    l.LoanStart = new Date(<string><any>l.LoanStart);
                    this.loans.push(l);
                });

                
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

        endLoan(loanId: number): void {
            this.loanApi.endLoan(loanId).then(() => {
                this.now = new Date();
                this.refreshLoans();
            });

        }

        isPast(endDate: Date): boolean {
            return endDate < this.now;
        }
    }
}