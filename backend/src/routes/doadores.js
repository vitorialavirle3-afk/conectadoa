const express = require('express');
const router = express.Router();

const connection = require('../database/connection');

router.get('/', async (req, res) => {
    try {
        const [doadores] = await connection.query(
            'SELECT * FROM doador WHERE ativo = TRUE ORDER BY nome'
        );

        res.json(doadores);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao buscar doadores.'
        });
    }
});

router.post('/', async (req, res) => {
    const {
        nome,
        cpf,
        email,
        telefone
    } = req.body;

    if (!nome || !cpf || !email) {
        return res.status(400).json({
            mensagem: 'Nome, CPF e e-mail são obrigatórios.'
        });
    }

    try {
        const [resultado] = await connection.query(
            `INSERT INTO doador
            (nome, cpf, email, telefone, data_cadastro, ativo)
            VALUES (?, ?, ?, ?, CURDATE(), TRUE)`,
            [nome, cpf, email, telefone]
        );

        res.status(201).json({
            mensagem: 'Doador cadastrado com sucesso!',
            id_doador: resultado.insertId
        });

    } catch (erro) {
        console.error(erro);

        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                mensagem: 'CPF ou e-mail já cadastrado.'
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao cadastrar doador.'
        });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    const {
        nome,
        cpf,
        email,
        telefone
    } = req.body;

    if (!nome || !cpf || !email) {
        return res.status(400).json({
            mensagem: 'Nome, CPF e e-mail são obrigatórios.'
        });
    }

    try {
        const [resultado] = await connection.query(
            `UPDATE doador
             SET nome = ?,
                 cpf = ?,
                 email = ?,
                 telefone = ?
             WHERE id_doador = ?`,
            [nome, cpf, email, telefone, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Doador não encontrado.'
            });
        }

        res.json({
            mensagem: 'Doador atualizado com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                mensagem: 'CPF ou e-mail já cadastrado.'
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao atualizar doador.'
        });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await connection.query(
            `UPDATE doador
             SET ativo = FALSE
             WHERE id_doador = ?`,
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Doador não encontrado.'
            });
        }

        res.json({
            mensagem: 'Doador inativado com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao inativar doador.'
        });
    }
});

module.exports = router;