class AuthError implements Error {
    name: string;
    message: string;
    stack?: string | undefined;

    constructor(name?: string, message?: string, stack?: string | undefined) {
        this.name = name || 'unauthorized';
        this.message = message || 'unauthorized: Authorization failed.';
        this.stack = stack;
    }
}

export default AuthError;