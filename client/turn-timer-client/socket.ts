import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object

const URL: string = import.meta.env.NODE_ENV === 'production' ? 'http://3.83.94.212' : 'http://localhost:3000' //'http://3.83.94.212/socket.io'; //'http://localhost:3000';

export const socket = io(URL, {autoConnect: false});