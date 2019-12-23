import * as path from 'path';

import { config } from './config/config';

import { RequestHandler, Router } from 'express';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { Logger } from './services/logger/logger';
import { ILogger } from './services/logger/ilogger';
import { ELoggerLevel } from './services/logger/elogger-level';
import { LogLineConsoleLog } from './services/logger/log-line-console-log';
import { LogLineConsoleWarn } from './services/logger/log-line-console-warn';
import { LogLineConsoleError } from './services/logger/log-line-console-error';

import { ShutdownHandler } from './services/shutdown/shutdown-handler';

import { IServerService } from './services/server/iserver-service';

import { ExpressServer } from './services/server/express-server/express-server';

import { ExpressVanillaRenderController } from './controller/express/express-vanilla-render-controller';

// create logger
const logger: ILogger = new Logger(new LogLineConsoleLog(),
  new LogLineConsoleWarn(),
  new LogLineConsoleError(),
  new LogLineConsoleError());
logger.setLevel(ELoggerLevel[config.logLevel as keyof typeof ELoggerLevel]);
logger.info('App', `running in mode: ${config.mode}`);

// create shutdown handler
new ShutdownHandler(logger);

// create server
const server: IServerService<RequestHandler, Router> = new ExpressServer();
// register middleware
server.registerMiddleware(helmet());
if (config.useCompression) {
  logger.info('App', 'Compression middleware enabled');
  server.registerMiddleware(compression());
}
server.registerMiddleware(morgan('dev', {stream: logger} as unknown as morgan.Options));
server.registerMiddleware(bodyParser.urlencoded({extended: true}));
server.registerMiddleware(bodyParser.text());
server.registerMiddleware(bodyParser.json({type: 'application/json'}));
if (config.disableCORS) {
  logger.info('App', 'CORS disabled');
  server.registerMiddleware(cors());
}
// register view engine
server.registerViewEngine(path.join(__dirname, '..', 'views'), 'pug');
// register static folder for static assets ( css etc. )
server.registerStaticPath(path.join(__dirname, '..', 'public'));

// register routes
server.registerRoute('/', new ExpressVanillaRenderController(logger, 'home', 'Home'));
server.registerRoute('*', new ExpressVanillaRenderController(logger, 'four-oh-four', '404 - Not Found'));

// start server
server.start(logger, config.port);
