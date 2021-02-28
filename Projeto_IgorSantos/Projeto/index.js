
//DESTAQUES
fetch("http://localhost:3000/produtos?destaque_like=true")
    .then(response => response.json())
    .then(registos => {
        mostraDestaques(registos);
    })
    .catch(erro => alert("Ocorreu um erro" + erro));

//FUNÇAO PARA MOSTRAR DESTAQUES(FILTRO)
function mostraDestaques(registos) {
    let conteudo = "";

    for (registo of registos) {

        if ((registo.foto_principal === undefined || registo.foto_principal === null) || (registo.foto_secundaria === undefined || registo.foto_secundaria === null)) {
            registo.foto_principal = "img/imgnotfound.jpg"
            registo.foto_secundaria = "img/imgnotfound.jpg"
        }

        conteudo += `<div class="img-individual"><a target="_blank" href="produto.html?id=${registo.id}"><img src="Imagens/${registo.foto_principal}"
                alt=""></a></div>`
    }
    //console.log(conteudo);
    document.querySelector(".imagens-area").innerHTML = conteudo;
}


//COOKIES 
let todosCookies = document.cookie;

if (todosCookies === "") {
    document.querySelector(".cookiesTexto").style.display = "block";
    document.querySelector(".btCookie").addEventListener("click", function () {
        document.querySelector(".cookiesTexto").style.display = "none";
        document.cookie = "primeiraVisita = false; max-age = 31536000"
    })
}

