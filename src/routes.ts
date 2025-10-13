import {Express, Request, Response} from 'express';
import { getKoloById, getTicketByUUID } from './services';
import { ListicDto } from './types';
import path from 'path';
import fs from 'fs';

const publicDir = path.resolve(__dirname, '..', 'public');

// rute za prikaz stranica na frontendu
export const registerRoutes = (app: Express) => {
    app.get('/', (_: Request, res: Response) => {
        res.sendFile(path.join(publicDir, 'index', 'index.html'));
    });

    app.get('/listic/:uuid', async (req: Request, res: Response) => {
        const { uuid } = req.params;
        let data: any = {};

        if (!uuid) {
          data.error = "UUID nije poslan";
        } else {
            try {
                const listic = await getTicketByUUID(uuid);
                if (!listic) {
                    data.error = "Listić nije pronađen"
                } else {
                    const dto: ListicDto = { listic };
                    const kolo = await getKoloById(listic.kolo_id);
                
                    if (kolo?.dobitni_brojevi) {
                        dto.is_winner = kolo.pobijednik_id === listic.korisnik_id;
                        dto.winning_numbers = kolo.dobitni_brojevi;
                    }
                
                    data = dto;
                }
            
            } catch (error) {
                console.error('Greška u /listic/:uuid:', error);
                data.error = "Greška na serveru";
            }
        }   

        const htmlPath = path.join(publicDir, 'listic', 'index.html');
        let html = fs.readFileSync(htmlPath, 'utf8');
        html = html.replace('</body>', `<script>window.listicData = ${JSON.stringify(data)};</script></body>`);

        res.send(html);  
    });

    app.get('/:page', (req: Request, res: Response) => {
        const page = req.params.page;
        const anonymousPages = ['index'];

        if (!anonymousPages.includes(page) && !req.oidc.isAuthenticated()) {
            return res.redirect('/');
        }

        res.sendFile(path.join(publicDir, page, 'index.html'), (err) => {
            if (err) return res.status(404).send('Not found');
        });
    });
}