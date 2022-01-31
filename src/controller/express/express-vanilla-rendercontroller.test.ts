import express from 'express';

import { ILogger } from '../../services/logger/ilogger';
import { ILogLine } from '../../services/logger/ilog-line';
import { Logger } from '../../services/logger/logger';
import { ExpressVanillaRenderController } from './express-vanilla-render-controller';

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

  const exp: unknown = jest.fn().mockImplementation(() => ({
    use,
    Router
  }));

  (exp as FakeExpress).Router = Router;

  return exp;
});

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
let expressVanillaRenderController: ExpressVanillaRenderController;
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


  expressVanillaRenderController = new ExpressVanillaRenderController(logger, 'template', 'title');
});
afterEach(() => jest.clearAllMocks());

describe('express-home-controller', () => {
  describe('registerHandlers', () => {
    it('should create a router', () => {
      expressVanillaRenderController.registerHandlers();

      expect(express.Router).toHaveBeenCalled();
    });

    it('should register a get route', () => {
      expressVanillaRenderController.registerHandlers();

      expect(express.Router().get).toHaveBeenCalled();
    });

    it('should return router', () => {
      const router: express.Router = expressVanillaRenderController.registerHandlers();

      expect(router).toBeTruthy();
    });

    it('should set path for get', () => {
      expressVanillaRenderController.registerHandlers();

      expect(getPath).toEqual('/');
    });

    it('should call render on get', () => {
      expressVanillaRenderController.registerHandlers();

      const render: jest.Mock = jest.fn();
      getCallback({}, {
        render
      });

      expect(render).toHaveBeenCalledTimes(1);
      expect(render).toHaveBeenCalledWith('template', {pageTitle: 'title'});
    });
  });
});
