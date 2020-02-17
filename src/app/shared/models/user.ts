// The user class
export class User {
    public username: string;
    public password: string;

    public constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}

// The credentials type
export type Credentials = Partial<User>;
