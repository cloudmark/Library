module Library.Home.Loan {
    interface ILoanViewModel {
        loans: Array<Models.ILoan>
    }

    class LoanController implements ILoanViewModel {
        public loans: Array<Models.ILoan>;

        constructor() {
            var viewModel = this;
        }
    }
}