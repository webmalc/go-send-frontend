// The user class
export class User {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}

// The credentials type
export type Credentials = Partial<User>;
