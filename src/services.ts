import { KoloRepository, ListicRepository } from "./db";
import { GenerateQRCodeResponse, Kolo, SaveNewTicketResponse } from "./types";
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// kolo
export async function getActiveRound(): Promise<Kolo | null> {
  return await KoloRepository.findActive();
}

export async function createNewRound(isActive: boolean = false): Promise<Kolo> {
  return await KoloRepository.create(isActive);
}

export async function closeRound(koloId: number): Promise<boolean> {
  return await KoloRepository.close(koloId);
}

export async function getCurrentRound(): Promise<Kolo | null> {
  return await KoloRepository.findCurrent();
}

export async function updateRound(koloId: number, fieldsToUpdate: Partial<Kolo>): Promise<boolean> {
  return await KoloRepository.update(koloId, fieldsToUpdate);
}


// listic
export async function storeTicket(uuid: string, lotoBrojevi: number[], documentId: string, koloId: number, korisnikId: string): Promise<boolean> {
  return await ListicRepository.create(uuid, lotoBrojevi, documentId, koloId, korisnikId);
}

export async function storeNewTicket(document: string, numbers: number[], korisnikId: string): Promise<SaveNewTicketResponse  > {
  const kolo = await getActiveRound();
  if (!kolo) {
    console.error('Nema aktivnog kola');
    return { isSuccess: false };
  }
  
  const uuid = uuidv4();
  const result: boolean = await storeTicket(uuid, numbers, document, kolo.id, korisnikId);
  
  return { uuid, isSuccess: result };
}

export async function generateQRCode(uuid: string, host: string): Promise<GenerateQRCodeResponse> {
  try {
    const url = `https://${host}/listic/${uuid}`;
    const qrCodeDataURL = await QRCode.toDataURL(url);
    return { isSuccess: true, qrCodeUrl: qrCodeDataURL };
  } catch (error) {
    console.error('Greška u generateQRCode:', error);
    return { isSuccess: false };
  }
}