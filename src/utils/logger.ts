


const winston = require('winston');
const WinstonLogStash = require('winston3-logstash-transport');
import  DailyRotateFile from 'winston-daily-rotate-file';
// import { isProdEnv } from './helper';

function isDevEnv() {
  return process.env.NODE_ENV === "development"
}

export function isProdEnv() {
  return process.env.NODE_ENV === "production" 
}

const customLevels = {
  levels: {
    trace: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
    fatal: 0,
  },
  colors: {
    trace: 'white',
    debug: 'green',
    info: 'green',
    warn: 'yellow',
    error: 'red',
    fatal: 'red',
  },
 };
  
 const devFormatter = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.splat(),
  winston.format.printf((info:any) => {
    const { timestamp, level, message, ...meta } = info;
  
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  }),
 );


 const prodFormatter = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    winston.format.errors({ stack: true }), 
    winston.format.json()
  );

  
 class Logger {
  private logger: any;
  
  constructor() {


 const trans =  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m'
  });


    const prodTransport = new winston.transports.File({
      filename: 'logs/server.log',
      level: 'info',
      format: prodFormatter,
      defaultMeta: { service: 'user-service' }
    });
    const transport = new winston.transports.Console({
      format: devFormatter,
    });
    

    this.logger = winston.createLogger({
      // level: isDevEnv() ? 'trace' : 'error',
      level: 'info', //everything info and above 
      levels: customLevels.levels,
      transports: [!isDevEnv() || !isProdEnv() ? transport : prodTransport , 
        trans
      ],
    });
    this.logger.add(new WinstonLogStash({
      mode: 'udp',
      host: process.env.LOGGING_SERVER_IP,
      port: process.env.LOGGING_SERVER_PORT,
      formatted: false
    }));
    // this.logger.add(new (winston.Logger) (new winston.transports.DailyRotateFile, {
    //   filename :' logs/my.log',
    //   datePattern : '.dd-MM-yyyy'
    // }))
    
    winston.addColors(customLevels.colors);
  }
  
  log(msg: any, meta?: any) {
    this.logger.log('trace', msg, meta);
  }
  
  debug(msg: any, meta?: any) {
    this.logger.debug(msg, meta);
  }
  
  info(msg: any, meta?: any) {
    this.logger.info(msg, meta);
  }
  
  warn(msg: any, meta?: any) {
    this.logger.warn(msg, meta);
  }
  
  error(msg: any, meta?: any) {
    this.logger.error(msg, meta);
  }
  
  fatal(msg: any, meta?: any) {
    this.logger.log('fatal', msg, meta);
  }
 }


 class Singleton {
  private static instance: Logger;
  constructor() {
      if (!Singleton.instance) {
          Singleton.instance = new Logger();
      }
  }

  getInstance() {
      return Singleton.instance;
  }

}
 export const logger = new Singleton().getInstance();


