import winston from 'winston';
import 'winston-mongodb';
import { randomBytes } from 'crypto';
import { LogIndentation } from '../shared/enums/logger/log-indentation.enum';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, colorize, json, label, printf, metadata } = winston.format;
const timestampFormat = 'MMM-DD-YYYY HH:mm:ss';
const appVersion = process.env.npm_package_version;
const generateLogId = (): string => randomBytes(16).toString('hex');
const { MONGODB_URI } = require('../startup/envconfig');
// Logger for MongoDB

export const httpLoggerDB = winston.createLogger({
  format: combine(
    json(),
    metadata()
  ),
  transports: [
    new winston.transports.MongoDB({
      // we'll use the existing database to preserve logs
      db: MONGODB_URI as string,
      collection: 'logs', // name of the table/collection
      options: { useUnifiedTopology: true }
    }),
  ],
});
/**/

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
          environment: process.env.NODE_ENV, // development/staging/production
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
      silent: process.env.NODE_ENV === 'test_env' // true/false
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
  ],
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
          environment: process.env.NODE_ENV, // development/staging/production
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