import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object
// const URL: string = import.meta.env.NODE_ENV === 'production' ? '' : 'http://3.83.94.212/3000'; //'http:
// const URL: string = 'http://192.168.0.25:3000';
const URL: string = 'https://3.83.94.212';

export const socket = io(URL, {autoConnect: false});