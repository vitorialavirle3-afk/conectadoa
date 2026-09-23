onectaDoa – Sistema de Gestão de Doações

Sobre o projeto

O ConectaDoa é um sistema web desenvolvido para auxiliar uma organização não governamental (ONG) no controle e gerenciamento de doações.

O projeto foi desenvolvido como parte da disciplina Projeto Integrador Extensionista I (PIE I) do curso de Análise e Desenvolvimento de Sistemas.

A proposta surgiu a partir da necessidade de organizar melhor as informações de doadores e doações, que anteriormente poderiam ser controladas através de planilhas separadas.

 Sobre a ONG

A Associação ConectaDoa atua na conexão entre pessoas que desejam realizar doações e pessoas em situação de vulnerabilidade.

A organização trabalha com a coleta e distribuição de itens como:

* alimentos;
* roupas;
* produtos de higiene;
* outros itens de necessidade básica.

O sistema foi planejado considerando um cenário em que a organização possui poucos recursos financeiros, dando preferência ao uso de tecnologias gratuitas ou de baixo custo.

Objetivo

O objetivo do ConectaDoa é centralizar as informações relacionadas aos doadores e às doações, facilitando o cadastro, a consulta e a organização dos dados.

Entre as principais funcionalidades previstas estão:

* autenticação de usuários;
* cadastro de doadores;
* consulta de doadores;
* registro de doações;
* cadastro dos itens de cada doação;
* classificação dos itens por categoria;
* consulta de doações;
* filtros por período;
* relatório mensal;
* exportação dos dados em CSV.

Tecnologias utilizadas

O projeto utiliza as seguintes tecnologias:

Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap 5.3.3

Backend

* Node.js
* Express
* JWT
* bcrypt
* CORS
* dotenv

Banco de dados

* MySQL

Ferramentas

* Visual Studio Code
* MySQL Workbench
* Postman
* Git
* GitHub

Estrutura do projeto


conectadoa/
│
├── README.md
├── .gitignore
├── .env.example
│
├── docs/
│   └── Relatorio.pdf
│
├── backend/
│   ├── src/
│   │   ├── database/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── dashboard.html
│   ├── doacoes.html
│   ├── doadores.html
│   ├── index.html
│   └── relatorios.html
│
└── database/
    ├── schema.sql
    └── seed.sql


Como instalar

1. Clonar o projeto

bash
git clone git@github.com:vitorialavirle3-afk/conectadoa.git


Depois, entre na pasta:

bash
cd conectadoa


Configurar o banco de dados

É necessário ter o MySQL instalado.

No MySQL Workbench, execute primeiro o arquivo:


database/schema.sql


Depois, para inserir alguns dados iniciais para testes, execute:


database/seed.sql


3. Configurar as variáveis de ambiente

Dentro da pasta `backend`, crie um arquivo chamado:


.env


Utilize o arquivo `.env.example` como referência.

Exemplo:

env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=conectadoa
DB_PORT=3306
JWT_SECRET=seu_segredo

As informações do banco devem ser alteradas de acordo com a configuração do computador utilizado.

O arquivo `.env` não deve ser enviado para o GitHub.

4.Instalar as dependências

Entre na pasta do backend:

bash
cd backend


Instale as dependências:

bash
npm install


### 5. Iniciar o servidor

Execute:

bash
npm start


O backend será iniciado localmente.

Por padrão, o servidor utiliza a porta:

text
3000


6. Executar o frontend

Os arquivos da pasta `frontend` podem ser utilizados para acessar a interface do sistema.

Durante o desenvolvimento, o frontend pode ser executado utilizando uma extensão como o **Live Server** no Visual Studio Code.

Banco de dados

O banco de dados utilizado pelo projeto é o **MySQL**.

As principais tabelas são:

* `usuario`
* `doador`
* `doacao`
* `categoria`
* `item_doacao`

A estrutura foi criada para permitir que uma doação esteja relacionada a um doador, a um usuário responsável pelo registro e a vários itens.

Segurança

O projeto utiliza algumas medidas básicas de segurança, como:

* senhas armazenadas utilizando hash com bcrypt;
* autenticação utilizando JWT;
* variáveis de ambiente para informações de configuração;
* arquivo `.env` protegido pelo `.gitignore`.

Em uma futura publicação do sistema, deverá ser utilizado HTTPS para proteger a comunicação entre o usuário e a aplicação.

Documentação

O documento de visão do projeto está disponível na pasta:

text
docs/


O arquivo contém informações sobre:

* contexto do projeto;
* problema identificado;
* solução proposta;
* requisitos;
* regras de negócio;
* casos de uso;
* modelagem do banco de dados;
* relacionamentos;
* wireframes;
* planejamento das próximas etapas.

Continuidade do projeto

O desenvolvimento do ConectaDoa está planejado em etapas.

PIE I

Nesta etapa foram realizados:

* levantamento do problema;
* definição da solução;
* requisitos;
* regras de negócio;
* casos de uso;
* modelagem inicial;
* wireframes;
* estrutura inicial do projeto.

PIE II

A próxima etapa terá como foco a implementação e evolução do sistema, principalmente:

* backend;
* frontend;
* integração com o banco de dados;
* autenticação;
* funcionalidades de cadastro e consulta.

PIE III

A etapa seguinte terá como foco:

* testes;
* correções;
* melhorias de segurança;
* preparação para publicação;
* evolução das funcionalidades.

Status do projeto

Em desenvolvimento.

O projeto está sendo desenvolvido de forma incremental, com novas funcionalidades sendo adicionadas conforme as etapas da disciplina.

Autoria

Vitória Lavirle

Projeto desenvolvido para fins acadêmicos no curso de Análise e Desenvolvimento de Sistemas.
