import { Express, Request, Response } from 'express';
import { validateDocument, validateLotoNumbersInput } from './validation';
import { ApiResponse, LotoNumbersValidationResult } from './types';
import { closeRound, createNewRound, generateQRCode, getActiveRound, storeNewTicket, updateRound } from './services';

/// API za m2m komunikaciju
export function registerExternalApi(app: Express, jwtCheck: any) {
  app.post('/new-round', jwtCheck, async (req: Request, res: Response) => {
    try {
      const activeKolo = await getActiveRound();
      if (activeKolo) {
        return res.status(204).end(); // dozvoljavamo max 1 aktivno kolo istovremeno
      }

      await createNewRound(true);
      return res.status(204).end();

    } catch (error) {
      console.error('Greška u /new-round:', error);
      return res.status(500).json({ message: 'Greška na serveru' } as ApiResponse);
    }
  });

  app.post('/close', jwtCheck, async (_: Request, res: Response) => {
    try {
      const activeKolo = await getActiveRound();
      if (!activeKolo) {
        return res.status(204).end(); // nema aktivnog kola
      }

      await closeRound(activeKolo.id);
      return res.status(204).end(); 
    } catch (error) {
      console.error('Greška u /close:', error);
      return res.status(500).json({ message: 'Greška na serveru' } as ApiResponse);
    }
  });

  app.post('/store-results', jwtCheck, async (req: Request, res: Response) => {
    const { numbers } = req.body;
    if (!numbers || !Array.isArray(numbers)) {
      return res.status(400).json({ message: 'Brojevi nisu poslani' } as ApiResponse);
    }

    try {
      const current = await getActiveRound();
      if (!current) {
        return res.status(400).json({ message: 'Nema aktivnog kola' } as ApiResponse);
      }

      await updateRound(current.id, { dobitni_brojevi: numbers });
      res.status(204).end();
    } catch (error) {
      console.error('Greška u /store-results:', error);
      return res.status(500).json({ message: 'Greška na serveru' } as ApiResponse);
    }

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