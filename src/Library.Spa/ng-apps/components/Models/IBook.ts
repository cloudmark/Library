module Library.Models {
	export interface IBook {
		Id: number;
		Name: string;
        Description: string;
        Loans: Array<Models.ILoanSummary>;
	}
}