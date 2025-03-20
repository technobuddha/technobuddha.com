import { type Request, type Response } from 'express';

import { browserSettings } from '#settings/browser';
import { userInterfaceSettings } from '#settings/user-interface';

export function status404(_req: Request, res: Response): void {
  res.statusMessage = 'NOT FOUND';
  res.status(404).render('error/404.mustache', {
    favicon: browserSettings.favicon,
    homePage: userInterfaceSettings.homePage,
  });
}
