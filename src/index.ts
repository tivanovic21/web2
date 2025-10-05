import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';
import { auth as jwtAuth } from 'express-oauth2-jwt-bearer';
import { auth as oidc } from 'express-openid-connect';
import { registerApi } from './api';
import { registerRoutes } from './routes';

dotenv.config();
const app = express();

const HOST = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT || 3000);
const publicDir = path.resolve(__dirname, '..', 'public');

const jwtCheck = jwtAuth({
    audience: process.env.AUTH_AUDIENCE,
    issuerBaseURL: process.env.AUTH_ISSUER,
    tokenSigningAlg: 'RS256'
});

app.use(
    oidc({
        authRequired: false,
        auth0Logout: true,
        secret: process.env.AUTH_CLIENT_SECRET,
        baseURL: process.env.AUTH0_BASE_URL,
        clientID: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        issuerBaseURL: process.env.AUTH_ISSUER,
        authorizationParams: {
            response_type: 'code',
            scope: 'openid profile email'
        }
    })
);

app.use(express.json());

app.use('/styles', express.static(path.join(publicDir, 'styles')));
app.use('/scripts', express.static(path.join(publicDir, 'scripts'))); 
app.use('/resources', express.static(path.join(publicDir, 'resources')));

registerRoutes(app);
registerApi(app, jwtCheck);

const httpsOptions: https.ServerOptions = {
    key: fs.readFileSync(path.join(__dirname, '..', 'server.key')),     
    cert: fs.readFileSync(path.join(__dirname, '..', 'server.cert'))
}

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Server running at https://${HOST}:${PORT}/`);
});