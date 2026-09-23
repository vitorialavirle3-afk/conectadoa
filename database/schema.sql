CREATE DATABASE IF NOT EXISTS conectadoa;

USE conectadoa;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('coordenador', 'voluntario') NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro DATE NOT NULL
);

CREATE TABLE doador (
    id_doador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_cadastro DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE doacao (
    id_doacao INT AUTO_INCREMENT PRIMARY KEY,
    id_doador INT NOT NULL,
    id_usuario INT NOT NULL,
    data_doacao DATE NOT NULL,
    descricao TEXT,
    status ENUM('pendente', 'entregue', 'cancelada') NOT NULL DEFAULT 'pendente',
    data_entrega DATE,

    CONSTRAINT fk_doacao_doador
        FOREIGN KEY (id_doador)
        REFERENCES doador(id_doador),

    CONSTRAINT fk_doacao_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);

CREATE TABLE item_doacao (
    id_item_doacao INT AUTO_INCREMENT PRIMARY KEY,
    id_doacao INT NOT NULL,
    id_categoria INT NOT NULL,
    descricao VARCHAR(150) NOT NULL,
    quantidade INT NOT NULL,

    CONSTRAINT fk_item_doacao_doacao
        FOREIGN KEY (id_doacao)
        REFERENCES doacao(id_doacao),

    CONSTRAINT fk_item_doacao_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
);