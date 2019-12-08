import { Request, Response, Router } from 'express';

import { ILogger } from '../../services/logger/ilogger';
import { IServerRouteHandler } from '../../services/server/iserver-route-handler';

export class ExpressVanillaRenderController implements IServerRouteHandler<Router> {
  private logger: ILogger;
  private template: string;
  private pageTitle: string;

  /**
   * Constructor.
   * @param {ILogger} logger - logger service provider.
   * @param {string} template - template to render for GET request to /.
   * @param {string} pageTitle - page title.
   */
  public constructor(logger: ILogger, template: string, pageTitle: string) {
    this.logger = logger;
    this.template = template;
    this.pageTitle = pageTitle;
  }

  /**
   * Register route handlers.
   * @return {Router} return route handler.
   */
  public registerHandlers(): Router {
    const router: Router = Router();

    router.get('/', (req: Request, res: Response) => res.render(this.template, {
      pageTitle: this.pageTitle
    }));

    return router;
  }
}
