module Library.Models {
	export interface IUser {
		Id: number;
		Name: string;
        Surname: string;
        Loans: Array<Models.ILoanSummary>;
	}
}