module Library.Models {
    export interface ILogin {
        ClientId: string;
        Secret: string;
        Username: string;
        Password: string; 
        Token: string; 
        IsLoggedIn: boolean; 
    }
}