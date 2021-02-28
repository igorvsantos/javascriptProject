//FUNÇÃO MOSTRAR REGISTOS NA PAGINA ADMIN
function mostraRegistos(registos) {
    let conteudo = "";
    for (registo of registos) {
        //console.log(registo);

        if ((registo.foto_principal === undefined || registo.foto_principal === null) || (registo.foto_secundaria === undefined || registo.foto_secundaria === null)) {
            registo.foto_principal = "img/imgnotfound.jpg"
            registo.foto_secundaria = "img/imgnotfound.jpg"
        }
        conteudo += `<tr><td><img class ="thumbnails" src="Imagens/${registo.foto_principal}"></td><td><img class ="thumbnails" src="Imagens/${registo.foto_secundaria}"></td><td>${registo.marca}</td><td>${registo.nome}</td><td>${registo.tipo_de_produto}</td><td>${registo.cor}</td><td>${registo.preco}</td><td>${registo.descricao}</td><td class="alteraDestaque"><span>` + ((registo.destaque) ? "&#10004;" : "&#10006;") + `</span></td><td><button type="button" class="btn btn-danger btElimina" data-id="${registo.id}" data-toggle="modal" data-target="#deleteModal">X</button></td><td><button type="button" class="btn btn-secondary btEdita" data-id="${registo.id}">Edit</button></td></tr>`;
    }

    document.querySelector("#tabeladados tbody").innerHTML = conteudo;
    document.querySelector("#totalRegistos").textContent = registos.length;
    //console.log("Tamanho=" + registos.length);

    //ELIMINAR REGISTO NA TABELA DO ADMIN 
    let botoes = document.getElementsByClassName("btElimina")
    //console.log(botoes);
    for (botao of botoes) {
        botao.onclick= function () {
            let id = this.getAttribute("data-id");

            document.querySelector(".modal-footer button").onclick = function () {
                fetch("http://localhost:3000/produtos/" + id, { method: "delete" })
                    .then(response => response.json())
                    .then(registos => {
                        //alert("Registo eliminado");
                        todosRegistos(registos);
                    })
                    .catch(erro => alert("Ocorreu um erro" + erro));
            }
        }
    }

    //ATUALIZAR INFORMAÇÃO DO REGISTO DA TABELA
    const nomeForm = document.getElementById("nome")
    const marcaForm = document.getElementById("marca")
    const corForm = document.getElementById("cor")
    const precoForm = document.getElementById("preco")
    const descricaoForm = document.getElementById("descricao")
    const btEdita = document.getElementById("btEditar")
    const btSubmit = document.getElementById("btRegistar")
    const btCancela = document.getElementById("btCancelar")

    let botoesEdit = document.getElementsByClassName("btEdita")

    let dataIdArtigo;

    for (botao of botoesEdit) {
        botao.onclick= function () {

            btSubmit.style.display = "none";
            btEdita.style.display = "block";
            btCancela.style.display = "block";
            //console.log(this.parentElement.parentElement)

            let marcaTxt = this.parentElement.parentElement.children[2].textContent
            let nomeTxt = this.parentElement.parentElement.children[3].textContent
            let corTxt = this.parentElement.parentElement.children[5].textContent
            let precoTxt = this.parentElement.parentElement.children[6].textContent
            let descricaoTxt = this.parentElement.parentElement.children[7].textContent

            nomeForm.value = nomeTxt;
            marcaForm.value = marcaTxt;
            corForm.value = corTxt;
            precoForm.value = precoTxt;
            descricaoForm.value = descricaoTxt;

            dataIdArtigo = this.parentElement.parentElement.children[10].children[0].getAttribute("data-id")
            //console.log(dataIdArtigo)
        }
    }

    //Atualizar o Registo
    btEdita.onclick= function (evento) {
        evento.preventDefault();
        //alert("alteração vai ser efetuada")
        //console.log(dataIdArtigo);

        fetch("http://localhost:3000/produtos/" + dataIdArtigo, {
            method: 'PATCH',
            body: JSON.stringify({
                nome: nomeForm.value,
                marca: marcaForm.value,
                cor: corForm.value,
                preco: precoForm.value,
                descricao: descricaoForm.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(json => {
                //console.log(json);
                document.getElementById("registoProduto").reset();
                todosRegistos();
            })
            .catch(erro => alert("Ocorreu um erro - registo único"));
    };

    //Cancelar atualização do Registo
    btCancela.onclick = function () {
        //alert("cancelado")
        document.getElementById("registoProduto").reset();
        btSubmit.style.display = "block";
        btEdita.style.display = "none";
        btCancela.style.display = "none";
    };

    //EDITAR DESTAQUE
    let destaquesTd = document.querySelectorAll(".alteraDestaque span")
    for (destaqueTd of destaquesTd) {
        destaqueTd.onclick = function (evento) {
            let id = evento.target.parentElement.parentElement.getElementsByClassName("btElimina")[0].getAttribute("data-id")
            //console.log(id);
            let value;

            fetch("http://localhost:3000/produtos/" + id)
                .then(response => response.json())
                .then(registo => {
                    if (registo.destaque) {
                        value = false;
                    } else { value = true };

                    fetch("http://localhost:3000/produtos/" + id, {
                        method: 'PATCH',
                        body: JSON.stringify({
                            destaque: value
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(json => {
                            //console.log(json);
                            todosRegistos();
                        })
                        .catch(erro => alert("Ocorreu um erro - registo único"));
                })
                .catch(erro => alert("Ocorreu um erro" + erro));
        };
    }

}


//MOSTRAR REGISTOS NA PAGINA ADMIN
fetch("http://localhost:3000/produtos")
    .then(response => response.json())
    .then(registos => {
        mostraRegistos(registos);
    })
    .catch(erro => alert("Ocorreu um erro" + erro));


//PESQUISA REGISTOS POR NOME PAGINA ADMIN 
document.getElementById("btPesquisa").onclick = function () {
    let valorPesquisa = document.getElementById("pesquisa").value;
    fetch("http://localhost:3000/produtos?nome_like=" + valorPesquisa)
        .then(response => response.json())
        .then(registos => {
            mostraRegistos(registos);
        })
        .catch(erro => alert("Ocorreu um erro" + erro));
};

//LIMPAR PESQUISA
document.getElementById("btLimpaPesquisa").onclick = function () {
    document.getElementById("pesquisa").value = "";
    fetch("http://localhost:3000/produtos")
        .then(response => response.json())
        .then(registos => {
            mostraRegistos(registos);
        })
        .catch(erro => alert("Ocorreu um erro" + erro));
};


//REGISTO DE PRODUTO NA BD (campos obrigatórios estão com required no html)
document.getElementById("registoProduto").onsubmit= function (evento) {
    evento.preventDefault();
    const dadosForm = new FormData(this);
    const dadosReaisForm = Object.fromEntries(dadosForm.entries());

    dadosReaisForm.destaque = (document.getElementById("destaque").checked) ? true : false;
    const dadosFinais = JSON.stringify(dadosReaisForm);

    fetch('http://localhost:3000/produtos', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: dadosFinais
    }).then(function (response) {
        return response.json();
    }).then(() => {
        //alert("Registo Inserido");
        document.getElementById("registoProduto").reset();
        return todosRegistos();
    }).catch((error) => {
        console.error('Error:', error);
    });
};

function todosRegistos() {
    fetch("http://localhost:3000/produtos")
        .then(response => response.json())
        .then(registos => {
            mostraRegistos(registos);
        })
        // .catch(erro => alert("Ocorreu um erro - todosRegistos"));
        .catch(erro => console.error("Ocorreu um erro - todosRegistos" + erro));
}

