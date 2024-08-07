import { verifyToken } from '../services/auth/auth.service';
import asyncHandler from 'express-async-handler';
import { InternalServerErrorException } from '../shared/exceptions/http.exceptions';
function registerSocketFunction(io: any, socket: any) {
    //custom receiver event ,open this doces not require any authentication
    socket.on("customevent", function (obj: any) {
        console.log('event is captured on server');
        const token = socket.handshake.auth.token;
        if (token) {
            //var isvalidtoken = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjNkMGRiMWE0NGQwOTFhY2NiNTQxNWEiLCJncnBzIjpbeyJfaWQiOiI1ZTEyZTlkYjQyOTBmNjEwMDgxNDA2NDciLCJ0aXRsZSI6IkFETUlOSVNUUkFUT1IiLCJncm91cHBlcm1pc3Npb24iOlt7Il9pZCI6IjVkMWVlZjc3ZjcxMDhjMzYzMDI5OTAwMCIsInRpdGxlIjoiUkVBRCJ9LHsiX2lkIjoiNWQxZWVmODRmNzEwOGMzNjMwMjk5MDAyIiwidGl0bGUiOiJVUERBVEUifSx7Il9pZCI6IjVkMWVlZjhiZjcxMDhjMzYzMDI5OTAwMyIsInRpdGxlIjoiREVMRVRFIn0seyJfaWQiOiI1ZDFlZWY3ZWY3MTA4YzM2MzAyOTkwMDEiLCJ0aXRsZSI6IkNSRUFURSJ9XX1dLCJpYXQiOjE3MTkyMTEyOTIsImV4cCI6MTcxOTIyOTI5Mn0.WRNaDgSuBIU0BvlHucHF0-GV5DaRfxbp1QY2op8S4vQ');
            var isvalidtoken = verifyToken(token, function (err: any, decoded: any) {
                if (err) {
                    throw new InternalServerErrorException(err);
                }
                if (decoded) {
                    io.to(`${socket.id}`).emit("customevent_response_from_server", { _socket: socket.id });
                }
            });
        }
    });

    socket.on("user:save", function (obj: any) {
        console.log(' user:save event is captured on server');
        io.to(`${socket.id}`).emit("user:read", { _socket: socket.id });
    });
}
export { registerSocketFunction }