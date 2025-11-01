import express from "express";
import dotenv from "dotenv";
import path from 'path';
import { registerRoutes } from "./routes";
import { registerInternalApi } from "./api";
import cookieParser from "cookie-parser";
import { KorisnikService } from "./services";

dotenv.config();
const app = express();

const HOST = process.env.RENDER_EXTERNAL_URL || 'localhost';
const PORT = Number(process.env.PORT || 3000);
const publicDir = path.resolve(__dirname, '..', 'public');

app.use(express.json());
app.use(cookieParser());

app.use('/styles', express.static(path.join(publicDir, 'styles')));
app.use('/scripts', express.static(path.join(publicDir, 'scripts'))); 
app.use('/resources', express.static(path.join(publicDir, 'resources')));

async function main() {
    const createDemoUsers = async () => {
        const testId = await KorisnikService.createDemoUser('test', 'test');
        console.log(`Demo korisnik: ${testId} test | test`);
    }

    // umjesto registracije
    await createDemoUsers();

    registerRoutes(app);
    registerInternalApi(app);

    const hostname = HOST == "localhost" ? HOST : '0.0.0.0';
    app.listen(PORT, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${PORT}/ and from outside on ${HOST}`);
    })
}

main();
