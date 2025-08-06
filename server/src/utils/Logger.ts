import winston from 'winston';
import 'winston-daily-rotate-file';


const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} ${level}: ${message}`;
});

const transports = [
  new winston.transports.Console(),
  new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'info',
    zippedArchive: true,
    maxFiles: '14d',
  }),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 1048576, // 1 MB
    maxFiles: 5,
  }),
];

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
            ({ level, message, label, timestamp }) =>
                `${timestamp} [${label}] ${level}: ${message}`
        )
    ),
 // transports,
 transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});