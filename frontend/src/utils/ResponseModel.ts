import { Game, Player, Tournament } from "./ActiveEntities"

export enum Status {
    SUCCESS = 'success',
    ERROR = 'error'
}

interface ResponseModel {
    user: {
        user_id: string,
        f_name: string,
        l_name: string,
        username: string,
        email: string,
        verified: boolean
    },
    accessToken: string,
    refreshToken: string
}

export class Response {
    status: Status
    msg: string
    result: ResponseModel | Tournament[] | Player[] | Game[] | undefined
    code: number

    constructor(status: Status, msg: string, code: number, result?: ResponseModel) {
        this.status = status;
        this.msg = msg;
        this.result = result;
        this.code = code;
    }
}

export function isResponseModel(result: any): result is ResponseModel {
    return (
        typeof result === 'object' &&
        result !== null &&
        'accessToken' in result &&
        typeof result.accessToken === 'string'
    );
}


export type { ResponseModel }
