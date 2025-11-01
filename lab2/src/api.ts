import { Express, Request, Response } from 'express';
import { AuthService, KorisnikService } from './services';
import { getUserIdForToken } from './tokenStore';

/// API za komunikaciju s frontendom
export function registerInternalApi(app: Express) {
  app.post('/api/login', async (req: Request, res: Response) => {
    try {
      const { username, password, isBrokenAuth } = req.body;
      const isSafe = !Boolean(isBrokenAuth);

      const token = await AuthService.authenticate(String(username), String(password), isSafe);
      if (!token) return res.status(500).json({ ok: false, error: 'Invalid token' });

      // pohranjujemo "session token" u cookie za simulaciju krađe sesije
      res.cookie(`session`, token, {
        httpOnly: isSafe,
        secure: false,
        maxAge: 30 * 60 * 1000,
        sameSite: 'lax'
      });

      return res.json({ok: true});
    } catch (error) {
      console.error('Error in /api/login:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  });

  app.post('/api/logout', (req: Request, res: Response) => {
    res.clearCookie('session');
    return res.json({ ok: true });
  });

  app.get('/api/me', async (req: Request, res: Response) => {
    try {
      const cookieToken = req.cookies?.session;
      const headerToken = req.header('session');

      const token = headerToken ?? cookieToken ?? null;
      const userId = getUserIdForToken(token);

      const user = await KorisnikService.getById(Number(userId));

      if (!user) {
        return res.status(404).json({ ok: false, loggedIn: false, error: 'User not found' });
      }

      return res.json({ ok: true, loggedIn: true, username: user.username });
    } catch (error) {
      console.error('Error in /api/me:', error);
      res.status(500).json({ ok: false, loggedIn: false, error: 'Internal server error' });
    }
  });
}