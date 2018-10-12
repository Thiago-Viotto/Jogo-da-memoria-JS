var limite = 0, opcao = 0;
var figuras = [];
var cartaVirada = [];
var frontFaces;
var inicio = 0; //controla inicio do jogo
var tam = 0; //controla o tamanho do tabuleiro
var contAcertos = 0;
var dimensaoTabuleiro;
var contCliqueInd = 0;
var ehIndividual = 0;
var ehGrupo = 0;
var recomeca = 0;

function verificaModoGrupo() {
    var radioGrupo = document.getElementById("radioGrupo").checked;
    if (radioGrupo === true) {
        document.getElementById("nomeJogador1").style.display = "inline";
        document.getElementById("nomeJogador2").style.display = "inline";
    }
    ehGrupo++; //indentifica qual é a opcao escolhida
}

function verificaModoInd() {
    var radioInd = document.getElementById("radioInd").checked;
    if (radioInd === true) {
        document.getElementById("nomeJogador1").style.display = "inline";
    }
    contCliqueInd++;
    if (contCliqueInd === 1) {
        document.getElementById("nomeJogador2").style.display = "none";
        contCliqueInd--;
    }
    ehIndividual++; //indentifica qual é a opcao escolhida
}

//2x2
function addDiv() {
    tam = 4;
    dimensaoTabuleiro = "2x2";
    ajustarImagem();
    alert("Você escolheu o tabuleiro 2x2");
}

//2x2
function iniciarJogo() {
    contAcertos = 0;
    cartaVirada = [];
    if (tam > 0) {  //só aparece a div tabuleiro se o usuario definir a dimensao do tabuleiro
        var inicioJogo = document.querySelector("#inicio");
        var gameOver = document.querySelector("#GameOver");
        inicioJogo.style.zIndex = -2; //coloca div Tabuleiro na frente
        gameOver.style.zIndex = -2; //coloca div GameOver atras
        if ((limite === 0) | (recomeca > 0)) {
            figuras = embaralhar(figuras);
            for (var i = 0; i < tam; i++) {
                //frontFaces = document.getElementsByClassName("Front");
                //backFaces = document.getElementsByClassName("Back");
                //frontFaces[i].classList.remove("virado","acertou");
                //backFaces[i].classList.remove("virado","acertou");
                var tabuleiro = document.getElementById("tabuleiro");
                var div = document.createElement("div");
                div.setAttribute("class", "carta"); //cria uma classe
                div.setAttribute("id", "carta" + i); //cria uma div com nomes diferentes de acordo com o i
                if (i === 0 || i === 2) { //posicionar carta em cima e embaixo
                    div.style.left = 15 + "px";
                } else {
                    div.style.left = (150 + 30) + "px";
                }
                if (i < 2)
                    div.style.top = 65 + "px";
                else
                    div.style.top = 280 + "px";

                div.addEventListener("click", virarCarta, false); //vira a carta quando a carta é clicada          

                var div2 = document.createElement("div");
                div2.setAttribute("class", "face Back");
                div.appendChild(div2);
                var div3 = document.createElement("div");
                div3.setAttribute("class", "face Front");
                div.appendChild(div3);
                tabuleiro.appendChild(div);
                document.body.appendChild(tabuleiro);
            }
            getCartaFront(); // muda a frente da carta por uma imagem

            //fimJogo.style.zIndex = -2;
            //fimJogo.removeEventListener("click", iniciarJogo, false);
        }
        limite = 1;
    }
}

function ajustarImagem() {
    for (var i = 0; i < tam; i++) { //2x2
        var figura = {
            src: "../img/" + i + ".jpg",
            id: i % (tam / 2)
        };
        figuras.push(figura);
        console.log(figuras);
    }
}


/* 1- Criar um array vazio
 * 2- Verificar o número de elementos do array
 * 3- Criar um índice com valor aleatório
 * 4- Avaliar se elemento existe no array novo
 * 5- Inserir o elemento no array novo
 */
function embaralhar(arrayVelho) {
    var novoArray = [];  //array vazio
    while (novoArray.length !== arrayVelho.length) { //verifica o número de elementos do array
        var d = Math.floor(Math.random() * arrayVelho.length); //gera valores aleatórios entre 0 e 10
        if (novoArray.indexOf(arrayVelho[d]) < 0) { //se não existir elemento no array
            novoArray.push(arrayVelho[d]); // preenche o novo Array
        }
    }

    return novoArray;
}

function virarCarta() {
    if (cartaVirada.length < 2) {  //vira duas cartas
        var faces = this.getElementsByClassName("face");
        //console.log(faces[0]); //faceBack
        if (faces[0].classList.length > 2) {
            return; //não permite que ao clicar duas vezes na mesma carta, ela desvira
        }
        faces[0].classList.toggle("virado"); //procura e desliga a face
        faces[1].classList.toggle("virado"); //procura e desliga a face
        //console.log(faces[0].classList);
        cartaVirada.push(this);
        if (cartaVirada.length === 2) {
            console.log(cartaVirada);
            if (cartaVirada[0].childNodes[1].id === cartaVirada[1].childNodes[1].id) {  //acertou duas cartas
                cartaVirada[0].childNodes[0].classList.toggle("acertou");
                cartaVirada[0].childNodes[1].classList.toggle("acertou");
                cartaVirada[1].childNodes[0].classList.toggle("acertou");
                cartaVirada[1].childNodes[1].classList.toggle("acertou");
                
                //acertouCarta();
                contAcertos++;
                cartaVirada = [];
                if (contAcertos === tam/2) {  //se acertou todas as cartas
                    gameOver();
                    recomeca++;
                }

            }
        }
    } else {
        //console.log(cartaVirada);
        cartaVirada[0].childNodes[0].classList.toggle("virado"); //no terceiro clique desvira as cartas viradas
        cartaVirada[0].childNodes[1].classList.toggle("virado");
        cartaVirada[1].childNodes[0].classList.toggle("virado");
        cartaVirada[1].childNodes[1].classList.toggle("virado");

        cartaVirada = [];
    }

}

function gameOver() {
    var fimJogo = document.querySelector("#GameOver");
    //var inicioJogo = document.querySelector("#inicio");
    fimJogo.style.zIndex = 10; //coloca div GameOver na frente 
    acertouCarta(); //seta valores do resultado
    fimJogo.addEventListener("click", iniciarJogo, false);
}

function acertouCarta() {
    var nomeJgVencedor = document.getElementById("nomeJgVencedor");
    var nomeJogador = document.getElementById("nomeJogador1").value;
    if(ehGrupo > ehIndividual){
        var nomeJogador2 = document.getElementById("nomeJogador2").value;
    }
    document.getElementById("nomeJgVencedor").value = nomeJogador;
    document.getElementById("dimEscolhida").value = dimensaoTabuleiro;
    document.getElementById("modoEscolhido").value = "Individual";
    document.getElementById("totalPontos").value = "testando";
    document.getElementById("totalTempo").value = "testando";
    
}

function getCartaFront() {
    frontFaces = document.getElementsByClassName("Front");
    for (var i = 0; i < tam; i++) {
        frontFaces[i].style.background = "url('" + figuras[i].src + "')";
        frontFaces[i].setAttribute("id", figuras[i].id);
    }
}

