import { Express, Request, Response } from 'express';
import { validateDocument, validateLotoNumbersInput } from './valdiation';
import { ApiResponse, LotoNumbersValidationResult } from './types';



/// API for m2m communication
export function registerExternalApi(app: Express, jwtCheck: any) {
  app.post('/new-round', jwtCheck, (_: Request, res: Response) => {
    res.status(204).end();
  });

  app.post('/close', jwtCheck, (_: Request, res: Response) => {
    res.status(204).end();
  });

  app.post('/store-results', jwtCheck, (req: Request, res: Response) => {
    const { numbers } = req.body;

    if (!numbers) {
      return res.status(400).json({ message: 'Missing numbers' } as ApiResponse);
    }

    res.status(204).end();
  });
}

export function registerInternalApi(app: Express) {
  app.post('/api/loto', (req: Request, res: Response) => {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' } as ApiResponse);
    }
    
    const { document, numbers } = req.body;
    const numbersValidation: LotoNumbersValidationResult = validateLotoNumbersInput(numbers);
    const documentValidation = validateDocument(document);

    if (!numbers) {
      return res.status(400).json({ message: 'Brojevi nisu poslani' } as ApiResponse);
    } else if (!numbersValidation.isValid) {
      return res.status(400).json({ message: numbersValidation.message } as ApiResponse);
    } else if (!document) {
      return res.status(400).json({ message: 'Dokument nije poslan' } as ApiResponse);
    } else if (!documentValidation) {
      return res.status(400).json({ message: 'Dokument nije validan' } as ApiResponse);
    }

    // TODO: upisi u bazu + generiraj QR kod
    return res.status(200).json({ message: 'OK' } as ApiResponse);
  })
}