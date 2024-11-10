export enum Status {
    SUCCESS = 'success',
    ERROR = 'error'
}

export class Response {
    status: Status
    msg: string
    result: object | undefined
    code: number

    constructor(status: Status, msg: string, code: number, result?: object) {
        this.status = status;
        this.msg = msg;
        this.result = result;
        this.code = code;
    }
}

