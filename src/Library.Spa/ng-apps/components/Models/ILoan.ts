module Library.Models {
	export interface ILoan {
		Id: number;
		Book: IBook;
		User:  IUser;
        LoanStart: Date;
        LoanEnd: Date;
    }

    export interface ILoanSummary {
        Id: number;
        BookId: number;
        UserFullName: string;
        UserId: number;
        LoanEnd: Date;
        LoanStart: Date;
        
    }

    export interface ILoanTrimmed {
        BookId: number; 
        UserId: number; 
        Days: number;
    }
}