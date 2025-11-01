import { KorisnikRepository } from "./db";
import { createPredictableToken, createSecureToken } from "./tokenStore";
import { Korisnik } from "./types";
import bcrypt from 'bcrypt';

export const KorisnikService = {
  async createDemoUser(username: string, password: string): Promise<number> {
    var existingUser = await KorisnikRepository.getByUsername(username);
    if (existingUser) {
      return existingUser.id;
    }
    const hash = await bcrypt.hash(password, 12);
    return await KorisnikRepository.createDemo(username, password, hash);
  },

  async getByUsername(username: string): Promise<Korisnik | null> {
    return await KorisnikRepository.getByUsername(username);
  },

  async getById(id: number): Promise<Korisnik | null> {
    const user = await KorisnikRepository.getById(id);
    return user;
  }
}

export const AuthService = {
  async authenticate(username: string, password: string, isSafe: boolean) : Promise<string | null> {
    const korisnik = await KorisnikRepository.getByUsername(username);
    if (korisnik == null) return null;

    if (!isSafe) {
      return this.createToken(username, korisnik.id, isSafe);
    } else {
      var isMatch = await bcrypt.compare(password, korisnik.password_hash);
      if (!isMatch) return null;
      return this.createToken(username, korisnik.id, isSafe);
    }
  },

  async createToken(username: string, id: number, isSafe: boolean): Promise<string> {
    return isSafe ? createSecureToken(username, id) : createPredictableToken(username, id);
  }
}