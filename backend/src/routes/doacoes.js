const express = require('express');
const router = express.Router();

const connection = require('../database/connection');

router.get('/', async (req, res) => {
    const { dataInicio, dataFim } = req.query;

    try {
        let sql = `
            SELECT
                d.id_doacao,
                d.data_doacao,
                d.descricao AS descricao_doacao,
                d.status,
                d.data_entrega,
                doador.id_doador,
                doador.nome AS nome_doador,
                categoria.id_categoria,
                categoria.nome AS categoria,
                item.descricao AS descricao_item,
                item.quantidade
            FROM doacao d
            INNER JOIN doador
                ON d.id_doador = doador.id_doador
            INNER JOIN item_doacao item
                ON d.id_doacao = item.id_doacao
            INNER JOIN categoria
                ON item.id_categoria = categoria.id_categoria
            WHERE 1 = 1
        `;

        const parametros = [];

        if (dataInicio) {
            sql += ` AND d.data_doacao >= ?`;
            parametros.push(dataInicio);
        }

        if (dataFim) {
            sql += ` AND d.data_doacao <= ?`;
            parametros.push(dataFim);
        }

        sql += `
            ORDER BY d.data_doacao DESC, d.id_doacao DESC
        `;

        const [doacoes] = await connection.query(
            sql,
            parametros
        );

        res.json(doacoes);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao buscar doações.'
        });
    }
});

router.get('/categorias', async (req, res) => {
    try {
        const [categorias] = await connection.query(
            `
            SELECT
                id_categoria,
                nome
            FROM categoria
            ORDER BY nome
            `
        );

        res.json(categorias);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao buscar categorias.'
        });
    }
});

router.get('/relatorio', async (req, res) => {
    const { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
        return res.status(400).json({
            mensagem: 'Informe a data inicial e a data final.'
        });
    }

    if (dataInicio > dataFim) {
        return res.status(400).json({
            mensagem: 'A data inicial não pode ser maior que a data final.'
        });
    }

    try {
        const [resultado] = await connection.query(
            `
            SELECT
                categoria.nome AS categoria,
                SUM(item.quantidade) AS quantidade
            FROM doacao d
            INNER JOIN item_doacao item
                ON d.id_doacao = item.id_doacao
            INNER JOIN categoria
                ON item.id_categoria = categoria.id_categoria
            WHERE d.data_doacao >= ?
              AND d.data_doacao <= ?
              AND d.status <> 'cancelada'
            GROUP BY
                categoria.id_categoria,
                categoria.nome
            ORDER BY categoria.nome
            `,
            [dataInicio, dataFim]
        );

        let total = 0;

        resultado.forEach(function (item) {
            total += Number(item.quantidade);
        });

        res.json({
            dataInicio,
            dataFim,
            categorias: resultado,
            total
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao gerar relatório.'
        });
    }
});

router.post('/', async (req, res) => {
    const {
        id_doador,
        data_doacao,
        id_categoria,
        quantidade,
        descricao,
        status,
        data_entrega
    } = req.body;

    if (
        !id_doador ||
        !data_doacao ||
        !id_categoria ||
        !quantidade
    ) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos obrigatórios.'
        });
    }

    if (quantidade <= 0) {
        return res.status(400).json({
            mensagem: 'A quantidade deve ser maior que zero.'
        });
    }

    try {
        const id_usuario = 1;

        await connection.query('START TRANSACTION');

        const [resultadoDoacao] = await connection.query(
            `
            INSERT INTO doacao
            (
                id_doador,
                id_usuario,
                data_doacao,
                descricao,
                status,
                data_entrega
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                id_doador,
                id_usuario,
                data_doacao,
                descricao || null,
                status || 'pendente',
                data_entrega || null
            ]
        );

        const id_doacao = resultadoDoacao.insertId;

        await connection.query(
            `
            INSERT INTO item_doacao
            (
                id_doacao,
                id_categoria,
                descricao,
                quantidade
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                id_doacao,
                id_categoria,
                descricao || 'Item da doação',
                quantidade
            ]
        );

        await connection.query('COMMIT');

        res.status(201).json({
            mensagem: 'Doação registrada com sucesso!',
            id_doacao
        });

    } catch (erro) {
        await connection.query('ROLLBACK');

        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao registrar doação.'
        });
    }
});

module.exports = router;