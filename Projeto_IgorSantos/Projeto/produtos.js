//FUNÇÃO MOSTRAR REGISTOS NA PAGINA PRODUTOS
function registosGaleria(registos) {
    let conteudo = "";

    for (registo of registos) {
        if ((registo.foto_principal === undefined || registo.foto_principal === null) || (registo.foto_secundaria === undefined || registo.foto_secundaria === null)) {
            registo.foto_principal = "img/imgnotfound.jpg"
            registo.foto_secundaria = "img/imgnotfound.jpg"
        }

        //Passagem do id pela querystring e passagem do cursor para mudar imagem
        conteudo += `
      <figure class="gallery-frame" data-id="${registo.id}"><a target="_self" href="produto.html?id=${registo.id}"> 
      <img class="gallery-img" src="Imagens/${registo.foto_principal}" alt="${registo.foto_principal}"
          title="${registo.foto_principal}" onmouseover="this.src='Imagens/${registo.foto_secundaria}'" onmouseout="this.src='Imagens/${registo.foto_principal}'"></a>
      <i class="far fa-star"></i> 
      <figcaption class="infoProdutos">
          <p>${registo.marca}</p>
          <p>${registo.nome}</p>
          <p>${registo.preco} €</p>
      </figcaption>
  </figure>`;
    }

    document.querySelector("#cntProdutos").innerHTML = conteudo;
    document.querySelector(".txtResultados").textContent = `Total de resultados: ${totalArtigos}`

    let vInicial = document.querySelectorAll("#cntProdutos figure").length
    //console.log(vInicial)

    if (vInicial != totalArtigos) {
        document.querySelector(".btnVerMais").onclick = function () {
            fetch(`http://localhost:3000/produtos?start=${vInicial}&_end=${vInicial + 6}`)
                .then(response => response.json())
                .then(registos => {
                    registosGaleria(registos);
                })
                .catch(erro => alert("Ocorreu um erro" + erro));
        }
    } else {
        document.querySelector(".btnVerMais").style.display = "none";
    }


    //ADICIONAR A WISHLIST
    let estrelas = document.querySelectorAll(".gallery-frame i");
    for (estrela of estrelas) {
        estrela.onclick = function () {

            addWish(this)
            //console.log(this.classList)
            let idKey = this.parentElement.getAttribute("data-id");
            let wishes = [];

            fetch(`http://localhost:3000/wishlist`) //?dataId_like=${idKey}
                .then(response => response.json())
                .then(registos => {
                    for (registo of registos) {
                        wishes.push(registo.dataId);
                    }
                    //console.log(wishes)
                    if (wishes.indexOf(idKey) === -1) {
                        //console.log("adicionado")

                        let fotoPrincipal = (this.previousElementSibling.firstElementChild.src).toString();

                        let fotoPrincipalString = fotoPrincipal.substr(fotoPrincipal.lastIndexOf('/') + 1, fotoPrincipal.length);

                        let wishlistData = {
                            foto_principal: fotoPrincipalString,
                            marca: this.nextElementSibling.children[0].textContent,
                            nome: this.nextElementSibling.children[1].textContent,
                            preco: this.nextElementSibling.children[2].textContent,
                            dataId: this.parentElement.getAttribute("data-id")
                        }
                        //console.log(wishlistData);
                        const dadosWishlist = JSON.stringify(wishlistData);
                        //console.log(dadosWishlist);

                        fetch('http://localhost:3000/wishlist', {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: dadosWishlist
                        }).then(function (response) {
                            return response.json();
                        }).catch((error) => {
                            console.error('Error:', error);
                        });

                    } else {
                        $('#wishModal').modal('show')
                    }
                })
                .catch(erro => alert("Ocorreu um erro" + erro));
        }
    }
}

function addWish(x) {
    x.classList.toggle("fas");
    x.style.color = 'red'
}

//FUNÇÃO PAGINA PRODUTOS PARA FILTRAR PRODUTOS
function filtrosGaleria(registos) {
    let conteudo2 = "";
    let conteudo3 = "";
    let unicoTipo = [];
    let unicaCor = [];
    for (registo of registos) {

        if (unicoTipo.indexOf(registo.tipo_de_produto) === -1) {
            unicoTipo.push(registo.tipo_de_produto)
        }
        if (unicaCor.indexOf(registo.cor) === -1) {
            unicaCor.push(registo.cor)
        }
    }
    unicoTipo.sort();
    unicaCor.sort();

    for (tipo of unicoTipo) {
        conteudo2 += `<li><div class="form-check">
    <input type="radio" id=${tipo} name="tipo_de_produto" value="${tipo}">
    <label for="tipo_de_produto">${tipo}</label>
    </div></li>`
    };

    for (cor of unicaCor) {
        conteudo3 += `<li><div class="form-check">
        <input type="radio" id=${cor} name="cor" value="${cor}">
        <label for="cor">${cor}</label>
        </div></li>`
    };

    //console.log(unicoTipo);
    //console.log(unicaCor);
    document.querySelector("#card1").innerHTML = conteudo2;
    document.querySelector("#card2").innerHTML = conteudo3;

    let listaFiltro = document.querySelectorAll(".listaFiltro li div input")
    //console.log(listaFiltro)

    for (vEscolhido of listaFiltro) {
        vEscolhido.onclick= function () {
            //console.log(this);
            fetch(`http://localhost:3000/produtos/?${this.name}=${this.value}`)
                .then(response => response.json())
                .then(registos => {
                    registosGaleria(registos);
                })
                .catch(erro => alert("Ocorreu um erro" + erro));

        }
    }
}


let totalArtigos;
//MOSTRAR PAGINA PRODUTOS
fetch("http://localhost:3000/produtos?_start=0&_end=6")
    .then(response => {
        totalArtigos = response.headers.get('x-total-count')
        return response.json()
    })
    .then(registos => {
        registosGaleria(registos);
        //console.log(totalArtigos)
    })
    .catch(erro => alert("Ocorreu um erro" + erro));


fetch("http://localhost:3000/produtos")
    .then(response => response.json())
    .then(registos => {
        filtrosGaleria(registos)
    })
    .catch(erro => alert("Ocorreu um erro" + erro));
