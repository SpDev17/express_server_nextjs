"use strict";
import { Server, Socket } from 'socket.io';
import { registerSocketFunction } from './function.socket';
import { verifyToken } from '../services/auth/auth.service';
function onConnect(io: Server, socket: any): void {
    //This is a reciever function, When the client emits 'info', this listens and executes
    socket.on("info", function (data: any): void {
        console.log("Info Socket : " + "[%s] %s", socket.address, JSON.stringify(data, null, 2));
    });
    //require('../collections/socket/function.socket').register(io, socket);
    registerSocketFunction(io, socket);
}

function onSocketInit(io: Server): void {
    io.on('connection', (socket: any) => {
        socket.address = socket.request.connection.remoteAddress + ":" + socket.request.connection.remotePort;
        socket.connectedAt = new Date();
        console.log('---------------------------------------------------------------------------------');
        console.log('A user is connected : ' + socket.address + '. socket id :' + socket.id);

        socket.on('disconnect', () => {
            console.log('A user is disconnected on socketio.js: ' + socket.address);
        });

        socket.on("connection_error", (err: any) => {
            console.log(err.req);
            console.log(err.code);
            console.log(err.message);
            console.log(err.context);
        });
        const token = socket.handshake.auth.token;
        //verifyToken(token);

        onConnect(io, socket);
    });
}

export { onSocketInit }