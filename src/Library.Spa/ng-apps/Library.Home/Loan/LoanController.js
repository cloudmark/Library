var Library;
(function (Library) {
    var Home;
    (function (Home) {
        var Loan;
        (function (Loan) {
            var LoanController = (function () {
                function LoanController() {
                    var viewModel = this;
                }
                return LoanController;
            })();
        })(Loan = Home.Loan || (Home.Loan = {}));
    })(Home = Library.Home || (Library.Home = {}));
})(Library || (Library = {}));
