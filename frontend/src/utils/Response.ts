export enum Status {
    SUCCESS = 'success',
    ERROR = 'error'
}

export class Response {
    status: Status
    msg: string
    result: {
        user_id: string,
        f_name: string,
        l_name: string,
        username: string,
        email: string,
        verified: boolean
    } | object | undefined
    code: number

    constructor(status: Status, msg: string, code: number, result?: object) {
        this.status = status;
        this.msg = msg;
        this.result = result;
        this.code = code;
    }
}

