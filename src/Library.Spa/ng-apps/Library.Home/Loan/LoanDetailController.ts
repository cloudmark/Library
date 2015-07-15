module Library.Home.Loan {

    interface ILoanDetailViewModel {
        loan: Models.ILoan; 
        getLoan(): void; 
        updateLoan(): void;
    }

    class LoanDetailController implements ILoanDetailViewModel {
        private $scope: ng.IScope; 
        private loanApi: Services.ILoanApiService; 
        public loan:  Models.ILoan; 
       
        constructor($scope: ng.IScope, loanApi: Services.ILoanApiService, $routeParams: ng.route.IRouteParamsService) {
            this.$scope = $scope; 
            this.loanApi= loanApi;
            this.getLoan();
        }

        getLoan(): void {
             // TODO: Implement this.
        }

   
        updateLoan(): void {
            // TODO: Implement this.  
        }
    
    }
}