import winston from 'winston';
import 'winston-mongodb';
import DailyRotateFile from 'winston-daily-rotate-file';
import { randomBytes } from 'crypto';
import { LogIndentation } from '../enum/log-indentation.enum';
const { combine, timestamp, colorize, json, label, printf, metadata } = winston.format;

const timestampFormat = 'MMM-DD-YYYY HH:mm:ss';


const generateLogId = (): string => randomBytes(16).toString('hex');
const { MONGODB_URI, NODE_ENV } = require('../../../startup/envconfig');
const appVersion = NODE_ENV;
// Logger for API endpoints
export const httpLogger = winston.createLogger({
    format: combine(
        timestamp({ format: timestampFormat }),
        json(),
        printf(({ timestamp, level, message, ...data }) => {
            const response = {
                level,
                logId: generateLogId(),
                timestamp,
                appInfo: {
                    appVersion,
                    environment: NODE_ENV, // development/staging/production
                    proccessId: process.pid,
                },
                message,
                data,
            };

            return JSON.stringify(response, null, LogIndentation.MD);
        })
    ),
    transports: [
        // log to console
        new winston.transports.Console({
            // if set to true, logs will not appear
            silent: true//process.env.NODE_ENV === 'test_env' // true/false
        }),
        // log to file, but rotate daily
        new DailyRotateFile({
            filename: 'public/logs/logs_Info-%DATE%.log', // file name includes current date
            datePattern: 'MMMM-DD-YYYY',
            zippedArchive: false, // zip logs true/false
            maxSize: '20m', // rotate if file size exceeds 20 MB
            maxFiles: '14d', // max files
            level: 'info',
        }),
        new DailyRotateFile({
            filename: 'public/logs/logs_Error-%DATE%.log', // file name includes current date
            datePattern: 'MMMM-DD-YYYY',
            zippedArchive: false, // zip logs true/false
            maxSize: '20m', // rotate if file size exceeds 20 MB
            maxFiles: '14d', // max files
            level: 'error',
        }),
        new DailyRotateFile({
            filename: 'public/logs/logs_Warn-%DATE%.log', // file name includes current date
            datePattern: 'MMMM-DD-YYYY',
            zippedArchive: false, // zip logs true/false
            maxSize: '20m', // rotate if file size exceeds 20 MB
            maxFiles: '14d', // max files
            level: 'warn',
        })
    ]
});


// Logger for MongoDB
export const httpLoggerDB = winston.createLogger({

    // in this case we do not need to worry about logId or Timestamp as MongoDB will generate that for us
    // the req, res data will be stored to "meta" object via metadata()
    format: combine(
        json(),
        metadata()
    ),
    transports: [
        /*
        new winston.transports.MongoDB({
            db: MONGODB_URI as string,
            collection: 'logs', // name of the table/collection where you want to store your logs
            options: { useUnifiedTopology: true }, // some stuff that CLI complains about
        }),
        /**/
        new winston.transports.Console({
            // if set to true, logs will not appear
            silent: true//process.env.NODE_ENV === 'test_env' // true/false
        })
    ],
});

// Logger for CLI outputs
export const cliLogger = winston.createLogger({
    format: combine(
        label({ label: appVersion }),
        timestamp({ format: timestampFormat }),
        colorize({ level: true }),
        printf(
            ({ level, message, label, timestamp }) =>
                `[${timestamp}] ${level} (${label}): ${message}`
        )
    ),
    transports: [new winston.transports.Console()],
});

// Logger for API endpoints
export const InternalLogger = winston.createLogger({
    format: combine(
        timestamp({ format: timestampFormat }),
        json(),
        printf(({ timestamp, level, message, ...data }) => {
            const response = {
                level,
                logId: generateLogId(),
                timestamp,
                appInfo: {
                    appVersion,
                    environment: NODE_ENV, // development/staging/production
                    proccessId: process.pid,
                },
                message,
                data,
            };

            return JSON.stringify(response, null, LogIndentation.MD);
        })
    ),
    transports: [
        // log to file, but rotate daily
        new DailyRotateFile({
            filename: 'public/logs/logs_Internal-%DATE%.log', // file name includes current date
            datePattern: 'MMMM-DD-YYYY',
            zippedArchive: false, // zip logs true/false
            maxSize: '20m', // rotate if file size exceeds 20 MB
            maxFiles: '14d', // max files
            level: 'info',
        })

    ],
});