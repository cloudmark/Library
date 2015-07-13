module Library.Home.User {
    interface IUserViewModel {
        users: Array<Models.IUser>
    }

    class UserController implements IUserViewModel {
        public users: Array<Models.IUser>;

        constructor() {
            var viewModel = this;

        }
    }
}