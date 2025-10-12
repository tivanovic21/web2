export type ApiResponse = {
  message: string;
  data?: any;
}

export type LotoNumbersValidationResult = {
    message: string;
    isValid: boolean;
}

export type RoundInfo = {
  isActive: boolean;
  numOfTickets: number;
  winningNumbers: number[] | null;
  koloId: number | null;
}

export type UserInfo = {
  isAuthenticated: boolean;
  user: User | null;
}

export type User = {
  name?: string;
}

export type Kolo = {
  id: number;
  is_active: boolean;
  dobitni_brojevi: number[] | null;
  broj_uplata: number;
  pobijednik_id?: string | null;
}

export type Listic = {
  id: number;
  uuid: string;
  kolo_id: number;
  loto_brojevi: number[];
  document_id: string;
  korisnik_id: string;
}

export interface ServiceResponse {
  isSuccess: boolean;
}

export interface SaveNewTicketResponse extends ServiceResponse {
  uuid?: string | null;
  koloId?: number | null;
}

export interface GenerateQRCodeResponse extends ServiceResponse {
  qrCodeUrl?: string | null;
  link?: string | null
}