import { KoloRepository, ListicRepository } from "./db";
import { GenerateQRCodeResponse, Kolo, Listic, SaveNewTicketResponse } from "./types";
import { v4 as uuidv4 } from 'uuid';

// kolo
export async function getActiveRound(): Promise<Kolo | null> {
  return await KoloRepository.findActive();
}

export async function getKoloById(koloId: number): Promise<Kolo | null> {
  return await KoloRepository.findById(koloId);
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

export async function incrementRoundTickets(koloId: number, incrementBy: number): Promise<boolean> {
  return await KoloRepository.incrementRoundTickets(koloId, incrementBy);
}

// listic
export async function storeTicket(uuid: string, lotoBrojevi: number[], documentId: string, koloId: number, korisnikId: string): Promise<boolean> {
  return await ListicRepository.create(uuid, lotoBrojevi, documentId, koloId, korisnikId);
}

export async function storeNewTicket(document: string, numbers: number[], korisnikId: string, koloId: number): Promise<SaveNewTicketResponse> {
  const kolo = await getActiveRound();
  if (!kolo) {
    console.error('Nema aktivnog kola');
    return { isSuccess: false };
  } else if (koloId && kolo.id !== koloId) {
    console.error('Poslano koloId ne odgovara aktivnom kolu');
    return { isSuccess: false };
  }
  
  const uuid = uuidv4();
  const result: boolean = await storeTicket(uuid, numbers, document, kolo.id, korisnikId);
  
  return { uuid, koloId: kolo.id, isSuccess: result };
}

export async function getTicketByUUID(uuid: string): Promise<Listic | null> {
  return await ListicRepository.findByUUID(uuid);
}

export async function getNumOfTickets(koloId: number): Promise<number | null> {
  return await ListicRepository.countByKoloId(koloId);
}

export async function getPlayersForRound(koloId: number): Promise<Listic[]> {
  return await ListicRepository.getAllByKoloId(koloId);
}