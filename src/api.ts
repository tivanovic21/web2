import { Express, Request, Response } from 'express';
import { validateDocument, validateLotoNumbersInput } from './validation';
import { ApiResponse, Kolo, LotoNumbersValidationResult } from './types';
import { generateQRCode, storeNewTicket } from './services';

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
      return res.status(400).json({ message: 'Brojevi nisu poslani' } as ApiResponse);
    }

    res.status(204).end();
  });
}

/// API za komunikaciju s frontendom
export function registerInternalApi(app: Express) {
  app.post('/api/loto', async (req: Request, res: Response) => {
    await handleLotoRequest(req, res);
  })
}

async function handleLotoRequest(req: Request, res: Response) {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' } as ApiResponse);
  }
  
  const { document, numbers } = req.body;
  const validationError = validateInput(document, numbers);
  if (validationError) {
    return res.status(400).json({message: validationError} as ApiResponse);
  }

  try {
    const ticketResponse = await storeNewTicket(document, numbers, req.oidc.user?.sub as string);
    
    if (!ticketResponse.isSuccess) {
      return res.status(500).json({ message: 'Greška pri spremanju listića' } as ApiResponse);
    }

    const qrResponse = await generateQRCode(ticketResponse.uuid!, `${req.get('host')}`);
    if (!qrResponse.isSuccess) {
      return res.status(500).json({ message: 'Greška pri generiranju QR koda' } as ApiResponse);
    }

    return res.status(200).json({ message: 'OK', data: qrResponse.qrCodeUrl } as ApiResponse & { qrCode: string });
  } catch (error) {
    return res.status(500).json({ message: 'Greška na serveru' } as ApiResponse);
  }
}

function validateInput(document: string, numbers: number[]): string | null {
  if (!numbers) return 'Brojevi nisu poslani';
  const numValidation: LotoNumbersValidationResult = validateLotoNumbersInput(numbers);
  if (!numValidation.isValid) return numValidation.message;
  if (!document) return 'Dokument nije poslan';
  if (!validateDocument(document)) return 'Dokument nije validan';
  return null;
}