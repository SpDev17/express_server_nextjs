import express from 'express';
const app = express();
import appSetup from './startup/init';
import routerSetup from './startup/router';
import securitySetup from './startup/security';

import { ErrorMessages } from './shared/enums/messages/error-messages.enum';
import { NodeProcessEvents } from './shared/enums/events/node-process-events.enum';
import { exceptionLogWrapper } from './shared/helpers/exception-log-wrapper.helper';

import dotenv from 'dotenv';
//dotenv.config();

process.on(NodeProcessEvents.UncaughtException, (error: unknown) => {
  exceptionLogWrapper(error, ErrorMessages.UncaughtException);
  process.exit(1);
});

process.on(NodeProcessEvents.UnhandledRejection, (error: unknown) => {
  exceptionLogWrapper(error, ErrorMessages.UnhandledRejection);
  process.exit(1);
});
dotenv.config();
void appSetup(app); // I put void because of ESLint
securitySetup(app, express);
routerSetup(app);
