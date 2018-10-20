var limite = 0, opcao = 0;
var figuras = [];
var cartaVirada = [];
var frontFaces;
var inicio = 0; //controla inicio do jogo
var contAcertos = 0;
var recomeca = 0;

/**
 * Enum
 */
var ModoJogo = {
  INDIVIDUAL: 0,
  GRUPO: 1
};

/**
 * Singleton class
 */
var Mesa = {
  preencherMesa: function(tamanho) {
    var numeroCartas = tamanho * tamanho;
    var numeroPares = tamanho * 2;
    
    if (tamanho == 2) {
        figuras = [];
        
        for (var i = 0; i < numeroCartas; i++) {
            
            var figura = {
                src: "../img/" + (i % numeroPares) + ".jpg",
                id: i % (Partida.tamanho)
            };
            
            figuras.push(figura);
        }
    }

    if (tamanho == 4) {
        figuras = [];
        
        for (var i = 0; i < numeroCartas; i++) {
            var figura = {
                src: "../img4x4/" + (i % numeroPares) + ".jpg",
                id: i % (Partida.tamanho)
            };
            
            figuras.push(figura);
        }
    }

    if (tamanho == 6) {
        figuras = [];
        
        for (var i = 0; i < numeroCartas; i++) {
            var figura = {
                src: "../img6x6/" + (i % numeroPares) + ".jpg",
                id: i % (Partida.tamanho)
            };
            figuras.push(figura);
            //console.log(figuras);
        }
    }
  }
};


/**
 * Singleton class
 */
var Partida = {
  tamanho: 0,
  modoJogo: ModoJogo.INDIVIDUAL,
  
  selecionarDimensao: function(tamanho, botao) {
    Partida.tamanho = tamanho;
    
    Mesa.preencherMesa(tamanho);
    
    var botoes = document.querySelectorAll(".botao-dimensao");
    for(var b of botoes) {
      b.style.backgroundColor = "";
    }
    
    botao.style.backgroundColor = "#0af";
  },
  
  mudarModoJogo: function(modo) {
    Partida.modoJogo = modo;
    
    if(modo == ModoJogo.GRUPO) {
      document.getElementById("nomeJogador2").style.visibility = "visible";
    }
    else {
      document.getElementById("nomeJogador2").style.visibility = "hidden";
    }
  }
};



function iniciarJogo() {
    if (recomeca > 0) {
        figuras = embaralhar(figuras);
        contAcertos = 0;
        cartaVirada = [];
        var frontFaces = document.getElementsByClassName("Front");
        var backFaces = document.getElementsByClassName("Back");
        for (var i = 0; i < Partida.tamanho * Partida.tamanho; i++) {
            frontFaces[i].classList.remove("virado", "acertou");
            backFaces[i].classList.remove("virado", "acertou");
        }
    }
    
    if(Partida.tamanho <= 0) {
      return;
    }
    
    var inicioJogo = document.querySelector("#inicio");
    var gameOver = document.querySelector("#GameOver");
    inicioJogo.style.zIndex = -2; //coloca div inicio atras e tabuleiro na frente
    gameOver.style.zIndex = -2; //coloca div GameOver atras
    if (limite === 0) {
        figuras = embaralhar(figuras);
        
        var tabuleiro = document.getElementById("tabuleiro");
        
        for (var linha = 0; linha < Partida.tamanho; linha++) {
            var linhaElement = document.createElement("div");
            
            for(var coluna = 0; coluna < Partida.tamanho; coluna++) {
                var div = document.createElement("div");
                div.setAttribute("class", "carta"); //cria uma classe
                div.setAttribute("id", "carta" + linha); //cria uma div com nomes diferentes de acordo com linha

                div.addEventListener("click", virarCarta, false); //vira a carta quando a carta é clicada          


                var div2 = document.createElement("div");
                div2.setAttribute("class", "face Back");
                div.appendChild(div2);
                var div3 = document.createElement("div");
                div3.setAttribute("class", "face Front");
                div.appendChild(div3);
                
                linhaElement.appendChild(div);
            }
           
           tabuleiro.appendChild(linhaElement);
        }
        
        document.body.appendChild(tabuleiro);
    }
    getCartaFront(); // muda a frente da carta por uma imagem
    limite = 1;
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
                if (contAcertos === Partida.tamanho * Partida.tamanho / 2) {  //se acertou todas as cartas
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
    console.log(figuras);
    fimJogo.addEventListener("click", iniciarJogo, false);
}

function acertouCarta() {
    var nomeJgVencedor = document.getElementById("nomeJgVencedor");
    var nomeJogador = document.getElementById("nomeJogador1").value;
    if (Partida.modoJogo == ModoJogo.GRUPO) {
        var nomeJogador2 = document.getElementById("nomeJogador2").value;
    }
    document.getElementById("nomeJgVencedor").value = nomeJogador;
    document.getElementById("dimEscolhida").value = Partida.tamanho + "x" + Partida.tamanho;
    document.getElementById("modoEscolhido").value = "Individual";
    document.getElementById("totalPontos").value = "testando";
    document.getElementById("totalTempo").value = "testando";

}

function getCartaFront() {
    frontFaces = document.getElementsByClassName("Front");
    for (var i = 0; i < Partida.tamanho * Partida.tamanho; i++) {
        frontFaces[i].style.background = "url('" + figuras[i].src + "')";
        frontFaces[i].setAttribute("id", figuras[i].id);
    }
}

