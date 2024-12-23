import { AxiosError } from "axios";
import { httpClient } from "./Network";
import { isResponseModel, Response as Res } from "./ResponseModel";

export function refreshAccessToken(refreshToken: string) {
    return new Promise((resolve: (value: string) => void, reject: (reason: AxiosError) => void) => {
        httpClient.post('/refresh-token', { refresh_token: refreshToken })
            .then(value => {
                const resData = value?.data as Res;
                if (resData) {
                    if (resData.result) {
                        if (isResponseModel(resData.result)) {
                            resolve(resData.result?.accessToken || "");
                        }
                    }
                } else {
                    resolve("");
                }
            }).catch((reason: AxiosError) => reject(reason))
    })
}

