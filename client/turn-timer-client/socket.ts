import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object
const URL: string = import.meta.env.MODE === 'production' ? import.meta.env.VITE_PROD_URL : 'http://localhost/3000'; //'http:
// const URL: string = 'http://192.168.0.25:3000';
// const URL: string = 'http://localhost:3000';
// const URL: string = 'https://54.175.61.41';

console.log(import.meta.env)

export const socket = io(URL, {autoConnect: false});