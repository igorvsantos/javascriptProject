function mostrarWishlist(registos) {
    let conteudo = ""
    for (const registo of registos) {

        conteudo += `   
        <div class="wishListLinha">
        <div class="pos1Wish col-4">
            <img class="gallery-img" src="Imagens/${registo.foto_principal}" alt="imagem"
                title="imagem">
        </div>

        <div class="pos2Wish col-4">
            <div>
                <p>${registo.marca}</p>
                <p>${registo.nome}</p>
                <p>${registo.preco}</p>
            </div>
        </div>

        <div class="pos3Wish col-4">
            <button type="button" class="btEliminaWish btn btn-danger" data-id="${registo.id}" data-toggle="modal" data-target="#deleteModalWish">Eliminar</button>
        </div>
    </div>`
    }

    document.querySelector("#cntWishlist").innerHTML = conteudo;


    //ELIMINAR ARTIGO DA WISHLIST
    let botoes = document.getElementsByClassName("btEliminaWish")

    for (botao of botoes) {
        botao.onclick = function () {

            //if (confirm("Confirma a eliminação do registo?")) {
            let id = this.getAttribute("data-id");
            //console.log(id);

            document.querySelector(".modal-footer button").onclick = function () {
                fetch("http://localhost:3000/wishlist/" + id, { method: "delete" })
                    .then(response => response.json())
                    .then(() => {
                        todosRegistos();
                    })
                    .catch(erro => alert("Ocorreu um erro" + erro));
            }
            // }
        }
    }
}

fetch("http://localhost:3000/wishlist")
    .then(response => response.json())
    .then(registos => {
        mostrarWishlist(registos);
    })
    .catch(erro => alert("Ocorreu um erro" + erro));


//Evita o erro registos not iterable
function todosRegistos() {
    fetch("http://localhost:3000/wishlist")
        .then(response => response.json())
        .then(registos => {
            mostrarWishlist(registos);
        })
        // .catch(erro => alert("Ocorreu um erro - todosRegistos"));
        .catch(erro => console.error("Ocorreu um erro - todosRegistos" + erro));
}

