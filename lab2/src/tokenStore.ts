import crypto from 'crypto';
import { Token } from "./types";

const store = new Map<string, Token>();
const EXPIRATION_TIME_MS = 30 * 60 * 1000; // 30 minuta

export function createPredictableToken(username: string, userId: number) : string {
    const token = `token-for-${username}`;
    store.set(token, { userId, username, expiresAt: Date.now() + EXPIRATION_TIME_MS });
    return token;
}

export function createSecureToken(username: string, userId: number) : string {
    const token = crypto.randomBytes(32).toString('hex');
    store.set(token, { userId, username, expiresAt: Date.now() + EXPIRATION_TIME_MS });
    return token;
}

export function invalidateToken(token: string) {
    store.delete(token);
}

export function getUserIdForToken(token?: string | null) {
    if (!token) return null;

    const info = store.get(token);
    if (!info) return null;

    if (info.expiresAt < Date.now()) {
        store.delete(token);
        return null;
    }
    
    return info.userId;
}

