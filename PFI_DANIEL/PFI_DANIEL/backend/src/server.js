import express from 'express';
import bodyParser from 'body-parser';
import app from './router/routes.js';
import cors from 'cors';

const server = express();
const PORT = 3000;

// Middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(cors());

// Rota de teste
server.get('/ping', (req, res) => {
    res.send('PONG');
});

server.use('/', app);

// Inicializa o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
