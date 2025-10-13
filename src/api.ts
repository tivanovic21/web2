import { Express, Request, Response } from 'express';
import { validateDocument, validateLotoNumbersInput } from './validation';
import { ApiResponse, GenerateQRCodeResponse, ListicDto, LotoNumbersValidationResult, RoundInfo, UserInfo } from './types';
import { closeRound, createNewRound, getActiveRound, getCurrentRound, getKoloById, getLastRound, getNumOfTickets, getPlayersForRound, getTicketByUUID, incrementRoundTickets, storeNewTicket, updateRound } from './services';
import QRCode from 'qrcode';

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
      const current = await getCurrentRound();
      if (!current) {
        return res.status(400).json({ message: 'Nema zatvorenog kola bez dobitnih brojeva' } as ApiResponse);
      }

      const players = await getPlayersForRound(current.id);
      let pobjednikId= null;

      if (players.length > 0) {
        for (const p of players) {
          if (numbers.every((num: number) => p.loto_brojevi.includes(num))) {
            pobjednikId = p.korisnik_id;
            break;
          }
        }
      }

      await updateRound(current.id, { dobitni_brojevi: numbers, pobijednik_id: pobjednikId });
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
    await _handleLotoRequest(req, res);
  });

  app.get('/api/user-info', (req: Request, res: Response) => {
      const result: UserInfo = {
          isAuthenticated: false,
          user: null
      }

      const isAuthenticated = req.oidc.isAuthenticated();

      if (!isAuthenticated) {
          return res.json(result);
      }

      result.isAuthenticated = true;
      result.user = {
          name: req.oidc.user?.name
      };
      
      res.json(result)
  });

  app.get('/api/round-info', async (req: Request, res: Response) => {
      const result: RoundInfo = {
          isActive: false,
          numOfTickets: 0,
          winningNumbers: null,
          koloId: null
      }

      let kolo = await getActiveRound();
      if (!kolo) {
          kolo = await getLastRound();
      }

      result.numOfTickets = await getNumOfTickets(kolo?.id ?? -1) ?? 0;
      result.winningNumbers = kolo?.dobitni_brojevi ?? null;
      result.koloId = kolo?.id ?? null;
      result.isActive = kolo?.is_active ?? false;

      res.json(result)
  });
}

// helper funkcije
async function _handleLotoRequest(req: Request, res: Response) {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' } as ApiResponse);
  }
  
  const { document, numbers, koloId } = req.body;
  const validationError = _validateInput(document, numbers);
  if (validationError) {
    return res.status(400).json({message: validationError} as ApiResponse);
  }

  try {
    const ticketResponse = await storeNewTicket(document, numbers, req.oidc.user?.sub as string, koloId);
    
    if (!ticketResponse.isSuccess) {
      return res.status(500).json({ message: 'Greška pri spremanju listića' } as ApiResponse);
    }

    await incrementRoundTickets(ticketResponse.koloId!, 1);

    const qrResponse = await _generateQRCode(ticketResponse.uuid!, `${req.get('host')}`);
    if (!qrResponse.isSuccess) {
      return res.status(500).json({ message: 'Greška pri generiranju QR koda' } as ApiResponse);
    }

    return res.status(200).json({ message: 'OK', data: { qrCodeUrl: qrResponse.qrCodeUrl, link: qrResponse.link } } as ApiResponse & { data: { qrCodeUrl: string, link: string } });
  } catch (error) {
    return res.status(500).json({ message: 'Greška na serveru' } as ApiResponse);
  }
}

function _validateInput(document: string, numbers: number[]): string | null {
  if (!numbers) return 'Brojevi nisu poslani';
  const numValidation: LotoNumbersValidationResult = validateLotoNumbersInput(numbers);
  if (!numValidation.isValid) return numValidation.message;
  if (!document) return 'Dokument nije poslan';
  if (!validateDocument(document)) return 'Dokument nije validan';
  return null;
}

async function _generateQRCode(uuid: string, host: string): Promise<GenerateQRCodeResponse> {
  try {
    const url = `https://${host}/api/listic/${uuid}`;
    const qrCodeDataURL = await QRCode.toDataURL(url);
    return { isSuccess: true, qrCodeUrl: qrCodeDataURL, link: url };
  } catch (error) {
    console.error('Greška u generateQRCode:', error);
    return { isSuccess: false };
  }
}