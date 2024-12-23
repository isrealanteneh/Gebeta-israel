import axios from "axios";
import { HTTP_BASE_URL, SOCKET_BASE_URL } from "../config";
import { io } from "socket.io-client";

export const httpClient = axios.create({
    baseURL: HTTP_BASE_URL,
})

export const socketClient = io(SOCKET_BASE_URL, {
    auth: { 'token': sessionStorage.getItem('accessToken') }
})
