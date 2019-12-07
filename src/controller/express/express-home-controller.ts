import { Request, Response, Router } from 'express';

import { ILogger } from '../../services/logger/ilogger';
import { IServerRouteHandler } from '../../services/server/iserver-route-handler';

export class ExpressHomeController implements IServerRouteHandler<Router> {
  private logger: ILogger;

  /**
   * Constructor.
   * @param {ILogger} logger - logger service provider.
   */
  public constructor(logger: ILogger) {
    this.logger = logger;
  }

  /**
   * Register route handlers.
   * @return {Router} return route handler.
   */
  public registerHandlers(): Router {
    const router: Router = Router();

    router.get('/', (req: Request, res: Response) => res.render('home'));

    return router;
  }
}
