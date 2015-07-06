module Library.Models {
    export interface IPagedList<T> {
        Data: Array<T>;
        Page: number;
        PageSize: number;
        TotalCount: number;
    }
} 