const express = require('express');
const cors = require('cors');

const connection = require('./database/connection');

const doadoresRoutes = require('./routes/doadores');
const doacoesRoutes = require('./routes/doacoes');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/doadores', doadoresRoutes);
app.use('/api/doacoes', doacoesRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({
        mensagem: 'Backend do ConectaDoa funcionando!'
    });
});

app.get('/teste-banco', async (req, res) => {
    try {
        const [resultado] = await connection.query(
            'SELECT 1 AS teste'
        );

        res.json({
            mensagem: 'Conexão com o banco funcionando!',
            resultado
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao conectar com o banco de dados.'
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});