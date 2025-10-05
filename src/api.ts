import { Express, Request, Response } from 'express';

/// API for m2m communication
export function registerApi(app: Express, jwtCheck: any) {
  app.post('/new-round', jwtCheck, (_: Request, res: Response) => {
    res.status(204).end();
  });

  app.post('/close', jwtCheck, (_: Request, res: Response) => {
    res.status(204).end();
  });

  app.post('/store-results', jwtCheck, (req: Request, res: Response) => {
    const { numbers } = req.body;

    if (!numbers) {
      return res.status(400).json({ error: 'Missing numbers' });
    }

    res.status(204).end();
  });
}