export type Korisnik = {
  id: number;
  username: string;
  password: string;
  password_hash: string;
}

export type Token = {
  userId: number;
  username: string;
  expiresAt: number;
}