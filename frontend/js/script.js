const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const mensagem = document.getElementById("mensagem");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        if (!email || !senha) {
            mensagem.innerHTML = `
                <div class="alert alert-danger">
                    Preencha todos os campos.
                </div>
            `;

            return;
        }

        mensagem.innerHTML = `
            <div class="alert alert-info">
                Entrando no sistema...
            </div>
        `;

        try {
            const resposta = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                mensagem.innerHTML = `
                    <div class="alert alert-danger">
                        ${dados.mensagem}
                    </div>
                `;

                return;
            }

            localStorage.setItem("token", dados.token);

            localStorage.setItem(
                "usuario",
                JSON.stringify(dados.usuario)
            );

            window.location.href = "dashboard.html";

        } catch (erro) {
            console.error("Erro ao realizar login:", erro);

            mensagem.innerHTML = `
                <div class="alert alert-danger">
                    Não foi possível conectar
                    com o servidor.
                </div>
            `;
        }
    });
}

function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href = "index.html";
}

async function cadastrarDoador() {
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const mensagem = document.getElementById("mensagemDoador");

    if (nome === "" || cpf === "" || email === "") {
        mensagem.innerHTML = `
            <div class="alert alert-danger">
                Preencha os campos obrigatórios.
            </div>
        `;

        return;
    }

    try {
        const resposta = await fetch(
            "http://localhost:3000/api/doadores",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome,
                    cpf: cpf,
                    email: email,
                    telefone: telefone
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.innerHTML = `
                <div class="alert alert-danger">
                    ${dados.mensagem}
                </div>
            `;

            return;
        }

        mensagem.innerHTML = `
            <div class="alert alert-success">
                Doador cadastrado com sucesso!
            </div>
        `;

        document
            .getElementById("formDoador")
            .reset();

        carregarDoadores();

    } catch (erro) {
        console.error(erro);

        mensagem.innerHTML = `
            <div class="alert alert-danger">
                Não foi possível cadastrar o doador.
            </div>
        `;
    }
}

async function salvarDoador() {
    const form = document.getElementById("formDoador");
    const id = form.getAttribute("data-id");

    if (id) {
        await atualizarDoador(id);
        return;
    }

    await cadastrarDoador();
}

async function atualizarDoador(id) {
    const form = document.getElementById("formDoador");

    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const mensagem = document.getElementById("mensagemDoador");

    if (nome === "" || cpf === "" || email === "") {
        mensagem.innerHTML = `
            <div class="alert alert-danger">
                Preencha os campos obrigatórios.
            </div>
        `;

        return;
    }

    try {
        const resposta = await fetch(
            `http://localhost:3000/api/doadores/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome,
                    cpf: cpf,
                    email: email,
                    telefone: telefone
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.innerHTML = `
                <div class="alert alert-danger">
                    ${dados.mensagem}
                </div>
            `;

            return;
        }

        mensagem.innerHTML = `
            <div class="alert alert-success">
                Doador atualizado com sucesso!
            </div>
        `;

        form.reset();
        form.removeAttribute("data-id");

        const titulo = document.querySelector(
            "#modalDoador .modal-title"
        );

        if (titulo) {
            titulo.textContent = "Novo Doador";
        }

        carregarDoadores();

        setTimeout(function () {
            const modalElement =
                document.getElementById("modalDoador");

            const modal =
                bootstrap.Modal.getInstance(modalElement);

            if (modal) {
                modal.hide();
            }
        }, 800);

    } catch (erro) {
        console.error(erro);

        mensagem.innerHTML = `
            <div class="alert alert-danger">
                Não foi possível atualizar o doador.
            </div>
        `;
    }
}

async function inativarDoador(id) {
    const confirmar = confirm(
        "Deseja realmente inativar este doador?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `http://localhost:3000/api/doadores/${id}`,
            {
                method: "DELETE"
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem);
            return;
        }

        alert("Doador inativado com sucesso!");

        carregarDoadores();

    } catch (erro) {
        console.error(erro);

        alert(
            "Não foi possível inativar o doador."
        );
    }
}

function pesquisarDoador() {
    const pesquisa = document
        .getElementById("pesquisa")
        .value
        .toLowerCase();

    const linhas = document.querySelectorAll(
        "#tabelaDoadores tr"
    );

    linhas.forEach(function (linha) {
        const texto =
            linha.textContent.toLowerCase();

        if (texto.includes(pesquisa)) {
            linha.style.display = "";
        } else {
            linha.style.display = "none";
        }
    });
}

async function carregarDoadores() {
    const tabela = document.getElementById(
        "tabelaDoadores"
    );

    if (!tabela) {
        return;
    }

    try {
        const resposta = await fetch(
            "http://localhost:3000/api/doadores"
        );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar doadores"
            );
        }

        const doadores = await resposta.json();

        tabela.innerHTML = "";

        if (doadores.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="text-center"
                    >
                        Nenhum doador cadastrado.
                    </td>
                </tr>
            `;

            return;
        }

        doadores.forEach(function (doador) {
            const linha =
                document.createElement("tr");

            linha.innerHTML = `
                <td>
                    ${doador.nome}
                </td>

                <td>
                    ${doador.cpf}
                </td>

                <td>
                    ${doador.email}
                </td>

                <td>
                    ${doador.telefone || "-"}
                </td>

                <td>
                    <span class="badge bg-success">
                        Ativo
                    </span>
                </td>

                <td>
                    <button
                        class="btn btn-sm btn-outline-primary"
                        onclick="editarDoador(${doador.id_doador})"
                    >
                        Editar
                    </button>

                    <button
                        class="btn btn-sm btn-outline-danger"
                        onclick="inativarDoador(${doador.id_doador})"
                    >
                        Inativar
                    </button>
                </td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error(erro);

        tabela.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="text-center text-danger"
                >
                    Não foi possível carregar os doadores.
                </td>
            </tr>
        `;
    }
}

async function editarDoador(id) {
    try {
        const resposta = await fetch(
            "http://localhost:3000/api/doadores"
        );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar doadores"
            );
        }

        const doadores = await resposta.json();

        const doador = doadores.find(
            function (item) {
                return item.id_doador === id;
            }
        );

        if (!doador) {
            alert("Doador não encontrado.");
            return;
        }

        document.getElementById("nome").value =
            doador.nome;

        document.getElementById("cpf").value =
            doador.cpf;

        document.getElementById("email").value =
            doador.email;

        document.getElementById("telefone").value =
            doador.telefone || "";

        document
            .getElementById("formDoador")
            .setAttribute("data-id", id);

        const titulo = document.querySelector(
            "#modalDoador .modal-title"
        );

        if (titulo) {
            titulo.textContent = "Editar Doador";
        }

        document.getElementById(
            "mensagemDoador"
        ).innerHTML = "";

        const modalElement =
            document.getElementById("modalDoador");

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.show();

    } catch (erro) {
        console.error(erro);

        alert(
            "Não foi possível carregar os dados do doador."
        );
    }
}

async function carregarDoadoresSelect() {
    const select =
        document.getElementById("doador");

    if (!select) {
        return;
    }

    try {
        const resposta = await fetch(
            "http://localhost:3000/api/doadores"
        );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar doadores"
            );
        }

        const doadores = await resposta.json();

        select.innerHTML = `
            <option value="">
                Selecione o doador
            </option>
        `;

        doadores.forEach(function (doador) {
            const option =
                document.createElement("option");

            option.value =
                doador.id_doador;

            option.textContent =
                doador.nome;

            select.appendChild(option);
        });

    } catch (erro) {
        console.error(erro);

        select.innerHTML = `
            <option value="">
                Erro ao carregar doadores
            </option>
        `;
    }
}

async function carregarCategorias() {
    const select =
        document.getElementById("categoria");

    if (!select) {
        return;
    }

    try {
        const resposta = await fetch(
            "http://localhost:3000/api/doacoes/categorias"
        );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar categorias"
            );
        }

        const categorias = await resposta.json();

        select.innerHTML = `
            <option value="">
                Selecione a categoria
            </option>
        `;

        categorias.forEach(function (categoria) {
            const option =
                document.createElement("option");

            option.value =
                categoria.id_categoria;

            option.textContent =
                categoria.nome;

            select.appendChild(option);
        });

    } catch (erro) {
        console.error(erro);

        select.innerHTML = `
            <option value="">
                Erro ao carregar categorias
            </option>
        `;
    }
}

function prepararNovaDoacao() {
    const form =
        document.getElementById("formDoacao");

    if (!form) {
        return;
    }

    form.reset();

    const mensagem =
        document.getElementById("mensagemDoacao");

    if (mensagem) {
        mensagem.innerHTML = "";
    }

    const hoje =
        new Date()
            .toISOString()
            .split("T")[0];

    const dataDoacao =
        document.getElementById("dataDoacao");

    if (dataDoacao) {
        dataDoacao.value = hoje;
    }

    const status =
        document.getElementById("status");

    if (status) {
        status.value = "pendente";
    }
}

async function registrarDoacao() {
    const idDoador =
        document.getElementById("doador").value;

    const dataDoacao =
        document.getElementById("dataDoacao").value;

    const idCategoria =
        document.getElementById("categoria").value;

    const quantidade =
        document.getElementById("quantidade").value;

    const descricao =
        document.getElementById("descricao").value;

    const status =
        document.getElementById("status").value;

    const dataEntrega =
        document.getElementById("dataEntrega").value;

    const mensagem =
        document.getElementById("mensagemDoacao");

    if (
        idDoador === "" ||
        dataDoacao === "" ||
        idCategoria === "" ||
        quantidade === ""
    ) {
        mensagem.innerHTML = `
            <div class="alert alert-danger">
                Preencha todos os campos obrigatórios.
            </div>
        `;

        return;
    }

    if (Number(quantidade) <= 0) {
        mensagem.innerHTML = `
            <div class="alert alert-danger">
                A quantidade deve ser maior que zero.
            </div>
        `;

        return;
    }

    try {
        const resposta = await fetch(
            "http://localhost:3000/api/doacoes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_doador: Number(idDoador),
                    data_doacao: dataDoacao,
                    id_categoria: Number(idCategoria),
                    quantidade: Number(quantidade),
                    descricao: descricao,
                    status: status,
                    data_entrega: dataEntrega || null
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.innerHTML = `
                <div class="alert alert-danger">
                    ${dados.mensagem}
                </div>
            `;

            return;
        }

        mensagem.innerHTML = `
            <div class="alert alert-success">
                Doação registrada com sucesso!
            </div>
        `;

        carregarDoacoes();

        document
            .getElementById("formDoacao")
            .reset();

        document.getElementById(
            "dataDoacao"
        ).value =
            new Date()
                .toISOString()
                .split("T")[0];

        document.getElementById(
            "status"
        ).value = "pendente";

        setTimeout(function () {
            const modalElement =
                document.getElementById(
                    "modalDoacao"
                );

            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );

            if (modal) {
                modal.hide();
            }
        }, 800);

    } catch (erro) {
        console.error(
            "Erro ao registrar doação:",
            erro
        );

        mensagem.innerHTML = `
            <div class="alert alert-danger">
                Não foi possível registrar a doação.
            </div>
        `;
    }
}

async function carregarDoacoes(
    dataInicio = "",
    dataFim = ""
) {
    const tabela =
        document.getElementById(
            "tabelaDoacoes"
        );

    if (!tabela) {
        return;
    }

    try {
        let url =
            "http://localhost:3000/api/doacoes";

        const parametros = [];

        if (dataInicio !== "") {
            parametros.push(
                `dataInicio=${dataInicio}`
            );
        }

        if (dataFim !== "") {
            parametros.push(
                `dataFim=${dataFim}`
            );
        }

        if (parametros.length > 0) {
            url +=
                "?" +
                parametros.join("&");
        }

        const resposta =
            await fetch(url);

        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar doações"
            );
        }

        const doacoes =
            await resposta.json();

        tabela.innerHTML = "";

        if (doacoes.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="text-center"
                    >
                        Nenhuma doação encontrada.
                    </td>
                </tr>
            `;

            return;
        }

        doacoes.forEach(function (doacao) {
            const linha =
                document.createElement("tr");

            linha.setAttribute(
                "data-data",
                formatarDataBanco(
                    doacao.data_doacao
                )
            );

            let classeStatus =
                "bg-warning text-dark";

            let textoStatus =
                "Pendente";

            if (doacao.status === "entregue") {
                classeStatus = "bg-success";
                textoStatus = "Entregue";
            }

            if (doacao.status === "cancelada") {
                classeStatus = "bg-danger";
                textoStatus = "Cancelada";
            }

            linha.innerHTML = `
                <td>
                    ${formatarData(
                        doacao.data_doacao
                    )}
                </td>

                <td>
                    ${doacao.nome_doador}
                </td>

                <td>
                    ${doacao.categoria}
                </td>

                <td>
                    ${doacao.quantidade}
                </td>

                <td>
                    ${doacao.descricao_item || "-"}
                </td>

                <td>
                    <span
                        class="badge ${classeStatus}"
                    >
                        ${textoStatus}
                    </span>
                </td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error(
            "Erro ao carregar doações:",
            erro
        );

        tabela.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="text-center text-danger"
                >
                    Não foi possível carregar as doações.
                </td>
            </tr>
        `;
    }
}

function filtrarDoacoes() {
    const dataInicio =
        document.getElementById(
            "dataInicio"
        ).value;

    const dataFim =
        document.getElementById(
            "dataFim"
        ).value;

    if (
        dataInicio !== "" &&
        dataFim !== "" &&
        dataInicio > dataFim
    ) {
        alert(
            "A data inicial não pode ser maior que a data final."
        );

        return;
    }

    carregarDoacoes(
        dataInicio,
        dataFim
    );
}

function limparFiltroDoacoes() {
    document.getElementById(
        "dataInicio"
    ).value = "";

    document.getElementById(
        "dataFim"
    ).value = "";

    carregarDoacoes();
}

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const dataString =
        formatarDataBanco(data);

    const partes =
        dataString.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarDataBanco(data) {
    if (!data) {
        return "";
    }

    if (
        typeof data === "string" &&
        data.includes("T")
    ) {
        return data.split("T")[0];
    }

    const dataString = String(data);

    return dataString.substring(0, 10);
}

async function gerarRelatorio() {
    const dataInicio =
        document.getElementById(
            "relatorioInicio"
        ).value;

    const dataFim =
        document.getElementById(
            "relatorioFim"
        ).value;

    const mensagem =
        document.getElementById(
            "mensagemRelatorio"
        );

    const resultado =
        document.getElementById(
            "resultadoRelatorio"
        );

    if (
        dataInicio === "" ||
        dataFim === ""
    ) {
        mensagem.innerHTML = `
            <div class="alert alert-danger">
                Informe a data inicial e a data final.
            </div>
        `;

        resultado.style.display = "none";

        return;
    }

    if (dataInicio > dataFim) {
        mensagem.innerHTML = `
            <div class="alert alert-danger">
                A data inicial não pode ser maior que a data final.
            </div>
        `;

        resultado.style.display = "none";

        return;
    }

    try {
        mensagem.innerHTML = `
            <div class="alert alert-info">
                Gerando relatório...
            </div>
        `;

        const resposta =
            await fetch(
                `http://localhost:3000/api/doacoes/relatorio?dataInicio=${dataInicio}&dataFim=${dataFim}`
            );

        const dados =
            await resposta.json();

        if (!resposta.ok) {
            mensagem.innerHTML = `
                <div class="alert alert-danger">
                    ${dados.mensagem}
                </div>
            `;

            resultado.style.display = "none";

            return;
        }

        document.getElementById(
            "periodoRelatorio"
        ).textContent =
            `${formatarData(dataInicio)} até ${formatarData(dataFim)}`;

        document.getElementById(
            "totalRelatorio"
        ).textContent =
            dados.total;

        document.getElementById(
            "totalTabela"
        ).textContent =
            dados.total;

        const tabela =
            document.getElementById(
                "tabelaRelatorio"
            );

        tabela.innerHTML = "";

        if (
            !dados.categorias ||
            dados.categorias.length === 0
        ) {
            tabela.innerHTML = `
                <tr>
                    <td
                        colspan="2"
                        class="text-center"
                    >
                        Nenhuma doação encontrada
                        no período informado.
                    </td>
                </tr>
            `;
        } else {
            dados.categorias.forEach(
                function (item) {
                    const linha =
                        document.createElement("tr");

                    linha.innerHTML = `
                        <td>
                            ${item.categoria}
                        </td>

                        <td>
                            ${item.quantidade}
                        </td>
                    `;

                    tabela.appendChild(linha);
                }
            );
        }

        resultado.style.display = "block";

        mensagem.innerHTML = `
            <div class="alert alert-success">
                Relatório gerado com sucesso!
            </div>
        `;

    } catch (erro) {
        console.error(
            "Erro ao gerar relatório:",
            erro
        );

        mensagem.innerHTML = `
            <div class="alert alert-danger">
                Não foi possível gerar o relatório.
            </div>
        `;

        resultado.style.display = "none";
    }
}

function verificarLogin() {
    const token =
        localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
    }
}

function exportarCSV() {
    const tabela =
        document.getElementById(
            "tabelaDoacoes"
        );

    if (!tabela) {
        alert(
            "Não foi possível encontrar a tabela de doações."
        );

        return;
    }

    const linhas =
        tabela.querySelectorAll("tr");

    if (linhas.length === 0) {
        alert(
            "Não existem doações para exportar."
        );

        return;
    }

    let csv =
        "\uFEFFData;Doador;Categoria;Quantidade;Descrição;Status\n";

    let encontrouDados = false;

    linhas.forEach(function (linha) {
        const colunas =
            linha.querySelectorAll("td");

        if (colunas.length >= 6) {
            const data =
                colunas[0].innerText.trim();

            const doador =
                colunas[1].innerText.trim();

            const categoria =
                colunas[2].innerText.trim();

            const quantidade =
                colunas[3].innerText.trim();

            const descricao =
                colunas[4].innerText.trim();

            const status =
                colunas[5].innerText.trim();

            csv +=
                `"${data}";` +
                `"${doador}";` +
                `"${categoria}";` +
                `"${quantidade}";` +
                `"${descricao}";` +
                `"${status}"\n`;

            encontrouDados = true;
        }
    });

    if (!encontrouDados) {
        alert(
            "Não existem doações para exportar."
        );

        return;
    }

    const arquivo =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );

    const url =
        URL.createObjectURL(arquivo);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "doacoes-conectadoa.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

document.addEventListener(
    "DOMContentLoaded",
    function () {
        const tabelaDoadores =
            document.getElementById(
                "tabelaDoadores"
            );

        if (tabelaDoadores) {
            carregarDoadores();
        }

        const tabelaDoacoes =
            document.getElementById(
                "tabelaDoacoes"
            );

        if (tabelaDoacoes) {
            carregarDoadoresSelect();
            carregarCategorias();
            carregarDoacoes();
        }
    }
);