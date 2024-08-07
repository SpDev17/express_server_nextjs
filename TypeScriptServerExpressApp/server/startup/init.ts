import { Express } from 'express';
import mongooseConnect from '../databases/mongodb/mongodb';
import { cliLoggerService } from '../services/logger/cli-logger.service';
import { ErrorMessages } from '../shared/enums/messages/error-messages.enum';
import { InfoMessages } from '../shared/enums/messages/info-messages.enum';
import { SpecialMessages } from '../shared/enums/messages/special-messages.enum';
import { exceptionLogWrapper } from '../shared/helpers/exception-log-wrapper.helper';

import { Server } from 'socket.io';
import { onSocketInit } from './socketio';
const { APP_PORT } = require('./envconfig');
const appSetup = async (app: Express) => {
    try {
        await Promise.all([
            mongooseConnect()
        ]);

        //console.log('Databases connected successfully!');
        //const APP_PORT = process.env.APP_PORT;
        cliLoggerService.info(InfoMessages.DatabasesConnected);
        cliLoggerService.info(SpecialMessages.DottedLine);

        const server = app.listen(APP_PORT,"0.0.0.0", () => {
            
            cliLoggerService.info(`Server started on port ${APP_PORT} 🚀🚀🚀`);
        });
        //socket
        //https://dev.to/admirnisic/real-time-communication-with-socketio-and-nodejs-3ok2
        const io = new Server(server, {
            cors: {
                origin: '*', // Allow any origin for testing purposes. This should be changed on production.
            },
            serveClient: true, path: "/socket.io", cookie: true
        });
        onSocketInit(io);

        //it ends here

    } catch (error: unknown) {
        //console.log('Unable to start the app!');
        //console.error(error);
        exceptionLogWrapper(error, ErrorMessages.AppStartupFail);
    }
};
export default appSetup;