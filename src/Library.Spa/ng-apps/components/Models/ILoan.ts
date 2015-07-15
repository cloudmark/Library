module Library.Models {
	export interface ILoan {
		Id: number;
		Book: IBook;
		User:  IUser;
        LoanStart: Date;
        LoanEnd: Date;
    }

    export interface ILoanTrimmed {
        BookId: number; 
        UserId: number; 
        Days: number;
    }
}