import express from 'express';
import path from 'path';
import { registerApi } from './api';

const app = express();

const HOST = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT || 3000);
const publicDir = path.resolve(__dirname, '..', 'public');

app.use('/styles', express.static(path.join(publicDir, 'styles')));
app.use('/scripts', express.static(path.join(publicDir, 'scripts'))); 
app.use('/resources', express.static(path.join(publicDir, 'resources')));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index', 'index.html'));
});
app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    res.sendFile(path.join(publicDir, page, 'index.html'), (err) => {
        if (err) return res.status(404).send('Not found');
    });
});

registerApi(app);

app.listen(PORT, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});