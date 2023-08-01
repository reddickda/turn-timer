import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object
const URL: string = import.meta.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1/3000'; //'http://localhost:3000';

export const socket = io(URL, {autoConnect: false});