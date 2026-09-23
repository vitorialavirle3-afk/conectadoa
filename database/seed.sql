USE conectadoa;

INSERT INTO usuario
(nome, email, senha, perfil, ativo, data_cadastro)
VALUES
(
    'Usuario Demo',
    'demo@conectadoa.org',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'coordenador',
    TRUE,
    CURDATE()
);

INSERT INTO doador
(nome, cpf, email, telefone, data_cadastro, ativo)
VALUES
(
    'Maria da Silva',
    '123.456.789-00',
    'maria@email.com',
    '(31) 99999-9999',
    CURDATE(),
    TRUE
),
(
    'João Pereira',
    '987.654.321-00',
    'joao@email.com',
    '(31) 98888-8888',
    CURDATE(),
    TRUE
),
(
    'Carlos Oliveira',
    '111.222.333-44',
    'carlos@email.com',
    '(31) 97777-7777',
    CURDATE(),
    TRUE
);

INSERT INTO categoria (nome)
VALUES
('Alimentos'),
('Roupas'),
('Higiene'),
('Outros');