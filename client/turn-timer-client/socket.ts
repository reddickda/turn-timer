import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object

const URL: string = 'https://3.83.94.212';

export const socket = io(URL, {autoConnect: false});