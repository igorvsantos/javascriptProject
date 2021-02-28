//RETIRAR O VALOR DA QUERYSTRING
var params = new URLSearchParams(window.location.search);
let id = params.get('id');

//MOSTRAR PRODUTO DETALHADO NA PAGINA PRODUTO
fetch("http://localhost:3000/produtos/" + id)  // get
    .then(response => response.json())
    .then(registo => {
        if ((registo.foto_principal === undefined || registo.foto_principal === null) || (registo.foto_secundaria === undefined || registo.foto_secundaria === null)) {
            registo.foto_principal = "img/imgnotfound.jpg"
            registo.foto_secundaria = "img/imgnotfound.jpg"
        }

        let conteudo = `<p class="txtDestaques">${registo.marca}</p>
               <h2>${registo.nome}</h2>
               <img class="gallery-img" src="Imagens/${registo.foto_principal}" alt="Image"
                   title="Image">
                   <img class="gallery-img" src="Imagens/${registo.foto_secundaria}" alt="Image"
                   title="Image">
               <figcaption class="infoPagProduto">
                   <p>${registo.tipo_de_produto} ${registo.cor}</p>
                   <p>${registo.preco} €</p>
                   <p>${registo.descricao}</p>
               </figcaption>`

        document.querySelector(".gallery-frame2").innerHTML = conteudo;

    })
    .catch(erro => alert("Ocorreu um erro" + erro));
