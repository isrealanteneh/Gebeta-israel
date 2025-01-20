import { httpClient } from "./Network";
import { Response } from './ResponseModel';

export async function handleUnauthorizedError(ex: any) {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) {
        sessionStorage.clear();
        window.location.href = "/login.html";
        return;
    }
    console.log(ex)
    try {
        const res = await httpClient.post('/refresh-token', { refresh_token: refreshToken });
        const resData = res?.data as Response;
        if (resData.result && 'accessToken' in resData.result) {
            const newAccessToken = (resData.result as { accessToken: string }).accessToken || "";
            sessionStorage.setItem('accessToken', newAccessToken);
            return newAccessToken;
        }
    } catch (reason) {
        console.log(reason);
    }
    return null;
}