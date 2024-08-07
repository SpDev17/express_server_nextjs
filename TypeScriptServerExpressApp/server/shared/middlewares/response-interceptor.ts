import { NextFunction, Request, Response } from 'express';
import { HTTPMethods } from '../enums/http/http-methods.enum';
import { SuccessMessages } from '../enums/messages/success-messages.enum';
import formatHTTPLoggerResponse from '../helpers/format-http-logger-response.helper';
//import { httpLogger, httpLoggerDB } from '../../services/logger.service';
import { dbLoggerService } from '../../services/logger/db-logger.service';
import { httpLoggerService } from '../../services/logger/http-logger.service';
import { HTTPStatusCode } from '../enums/http/http-status-codes.enum';
const { LogToDb } = require('../../startup/envconfig');
const responseInterceptor = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // used to calculate time between request and the response
    const requestStartTime = Date.now();

    // Save the original response method
    const originalSend = res.send;

    // Create a flag to track whether the response has been sent
    let responseSent = false;

    // Override the response method
    res.send = function (responseBody: any): Response {
        // Log the response body or any other data you want to track
        // responseSent is used to block the same request from been sent twice
        if (!responseSent) {
            // Failed requests are logged from global middleware exception handler
            if (res.statusCode < HTTPStatusCode.BadRequest) {
                httpLoggerService.info({ req, res, responseBody })
                if (LogToDb === 'true') {
                    dbLoggerService.info({ req, res, responseBody });
                }
            }
            responseSent = true;
        }

        // Call the original response method
        return originalSend.call(this, responseBody);
    };
    /*
    res.send = function (body: any): Response {
        // Log the response body or any other data you want to track
        // responseSent is used to block the same request from been sent twice
        if (!responseSent) {
            if (res.statusCode < 400) {
                httpLogger.info(
                    getResponseMessage(req.method),
                    formatHTTPLoggerResponse(req, res, body, requestStartTime)
                );
                if (LogToDb) {
                    httpLoggerDB.info(
                        getResponseMessage(req.method),
                        formatHTTPLoggerResponse(req, res, body, requestStartTime)
                    );
                }
                
} else {
    httpLogger.error(
        body.message,
        formatHTTPLoggerResponse(req, res, body, requestStartTime)
    );
if (LogToDb) {
    httpLoggerDB.error(
        body.message,
        formatHTTPLoggerResponse(req, res, body, requestStartTime)
    );
}
                
            }

responseSent = true;
        }

// Call the original response method
return originalSend.call(this, body);
    };
/**/

    // Continue processing the request

    next();
};

export default responseInterceptor;

function getResponseMessage(responseMethod: HTTPMethods | string): string {
    switch (responseMethod) {
        case HTTPMethods.POST:
            return SuccessMessages.CreateSuccess;
        case HTTPMethods.GET:
            return SuccessMessages.GetSuccess;
        case HTTPMethods.PUT || HTTPMethods.PATCH:
            return SuccessMessages.UpdateSuccess;
        case HTTPMethods.DELETE:
            return SuccessMessages.DeleteSuccess;
        default:
            return SuccessMessages.GenericSuccess;
    }
}