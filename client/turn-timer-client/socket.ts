import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object
const URL: string = import.meta.env.MODE === 'production' ? import.meta.env.VITE_PROD_URL : 'http://localhost/3000'; //'http:


export const socket = io(URL, {autoConnect: false});