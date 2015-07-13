module Library.Models {
	export interface ILoan {
		Id: number;
		Book: string;
		User:  string;
		DateTime: Date;
	}
}