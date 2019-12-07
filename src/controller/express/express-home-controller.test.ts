let getPath: string;
let getCallback: (req: object, res: object) => void;
jest.mock('express', () => {
  const use: jest.Mock = jest.fn();
  const get: jest.Mock = jest.fn().mockImplementation((path: string, cb: (req: object, res: object) => void) => {
    getPath = path;
    getCallback = cb;
  });
  const Router: jest.Mock = jest.fn().mockImplementation(() => ({
    get
  }));

  type FakeExpress = {
    Router: jest.Mock;
  };

  const express: unknown = jest.fn().mockImplementation(() => ({
    use,
    Router
  }));

  (express as FakeExpress).Router = Router;

  return express;
});
import * as express from 'express';

import { ILogger } from '../../services/logger/ilogger';
import { ILogLine } from '../../services/logger/ilog-line';
import { Logger } from '../../services/logger/logger';
import { ExpressHomeController } from './express-home-controller';

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
let expressHomeController: ExpressHomeController;
beforeEach(() => {
  logLineSpy = jest.fn();
  warnLineSpy = jest.fn();
  errorLineSpy = jest.fn();
  assertLineSpy = jest.fn();

  log = {log: logLineSpy};
  warn = {log: warnLineSpy};
  error = {log: errorLineSpy};
  assert = {log: assertLineSpy};
  logger = new Logger(log, warn, error, assert);


  expressHomeController = new ExpressHomeController(logger);
});
afterEach(() => jest.clearAllMocks());

describe('express-home-controller', () => {
  describe('registerHandlers', () => {
    it('should create a router', () => {
      expressHomeController.registerHandlers();

      expect(express.Router).toHaveBeenCalled();
    });

    it('should register a get route', () => {
      expressHomeController.registerHandlers();

      expect(express.Router().get).toHaveBeenCalled();
    });

    it('should return router', () => {
      const router: express.Router = expressHomeController.registerHandlers();

      expect(router).toBeTruthy();
    });

    it('should set path for get', () => {
      expressHomeController.registerHandlers();

      expect(getPath).toEqual('/');
    });

    it('should call render on get', () => {
      expressHomeController.registerHandlers();

      const render: jest.Mock = jest.fn();
      getCallback({}, {
        render
      });

      expect(render).toHaveBeenCalledTimes(1);
      expect(render).toHaveBeenCalledWith('home');
    });
  });
});
