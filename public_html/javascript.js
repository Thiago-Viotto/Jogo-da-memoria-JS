var cartaVirada = [];
var frontFaces;
var contAcertos = 0;

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
  cartas: [],
  
  preencherMesa: function(tamanho) {
    var numeroCartas = tamanho * tamanho;
    var numeroPares = tamanho * 2;
    
    Mesa.cartas = [];
    
    for (var i = 0; i < numeroCartas; i++) {
      var figura = {
        src: "../img/" + (i % numeroPares) + ".jpg",
        id: i % (Partida.tamanho)
      };
      
      Mesa.cartas.push(figura);
    }
  },
  
  embaralhar: function() {
    var novoArray = [];
    while (novoArray.length !== Mesa.cartas.length) {
        var d = Math.floor(Math.random() * Mesa.cartas.length);
        if (novoArray.indexOf(Mesa.cartas[d]) < 0) {
            novoArray.push(Mesa.cartas[d]);
        }
    }

    Mesa.cartas = novoArray;
  }
};


/**
 * Class
 */
var Jogador = function(nome) {
  this.nome = nome;
  this.acertos = 0;
}

/**
 * Enum
 */
var GameState = {
  NOT_RUNNING: 0,
  RUNNING: 1
};


/**
 * Singleton class
 */
var Partida = {
  tamanho: 0,
  modoJogo: ModoJogo.INDIVIDUAL,
  state: GameState.NOT_RUNNING,
  
  jogadores: [],
  
  jogadorAtual: 0,
  
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
  },
  
  iniciarJogo: function() {
    Partida.jogadores = [];
    
    Partida.jogadores.push(new Jogador(document.getElementById("nome1").value.trim()));
    
    if(Partida.modoJogo == ModoJogo.GRUPO) {
      Partida.jogadores.push(new Jogador(document.getElementById("nome2").value.trim()));
    }
    
    Partida.jogadorAtual = -1;
    Partida.proximoJogador();
    
    cartaVirada = [];
    var frontFaces = document.getElementsByClassName("Front");
    var backFaces = document.getElementsByClassName("Back");
    for (var i = 0; i < frontFaces.length; i++) {
        frontFaces[i].classList.remove("virado", "acertou");
        backFaces[i].classList.remove("virado", "acertou");
    }
    
    if(Partida.tamanho <= 0) {
      return;
    }
    
    var inicioJogo = document.querySelector("#inicio");
    var gameOver = document.querySelector("#GameOver");
    inicioJogo.style.zIndex = -2; //coloca div inicio atras e tabuleiro na frente
    gameOver.style.zIndex = -2; //coloca div GameOver atras
    
    Mesa.embaralhar();
    
    var cartasElement = document.getElementById("cartas");
    cartasElement.innerHTML = "";
    
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
       
       cartasElement.appendChild(linhaElement);
    }
    
    document.body.appendChild(document.getElementById("tabuleiro"));
    
    getCartaFront(); // muda a frente da carta por uma imagem
  },
  
  reiniciarJogo: function() {
    Partida.iniciarJogo();
  },
  
  gameOver: function() {
    var fimJogo = document.querySelector("#GameOver");
    //var inicioJogo = document.querySelector("#inicio");
    fimJogo.style.zIndex = 10; //coloca div GameOver na frente 
    acertouCarta(); //seta valores do resultado
    fimJogo.addEventListener("click", Partida.iniciarJogo, false);
  },
  
  proximoJogador: function() {
    Partida.jogadorAtual++;
    Partida.jogadorAtual = Partida.jogadorAtual % Partida.jogadores.length;
    
    var nome = Partida.jogadores[Partida.jogadorAtual].nome;
    
    document.getElementById("playerTurn").innerHTML = "&nbsp;";
    
    if(Partida.jogadores.length > 1) {
      document.getElementById("playerTurn").innerText = "Vez do jogador " + (Partida.jogadorAtual + 1) + (nome.length > 0? ": " + nome: "");
    }
  }

};




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
            if (cartaVirada[0].childNodes[1].id === cartaVirada[1].childNodes[1].id) {  //acertou duas cartas
                cartaVirada[0].childNodes[0].classList.toggle("acertou");
                cartaVirada[0].childNodes[1].classList.toggle("acertou");
                cartaVirada[1].childNodes[0].classList.toggle("acertou");
                cartaVirada[1].childNodes[1].classList.toggle("acertou");

                //acertouCarta();
                Partida.jogadores[Partida.jogadorAtual].acertos++;
                
                cartaVirada = [];
                
                var acertos = Partida.jogadores[0].acertos;
                if(Partida.modoJogo == ModoJogo.GRUPO) {
                  acertos += Partida.jogadores[1].acertos;
                }
                
                // se acertou todas as cartas
                if (acertos === Partida.tamanho * Partida.tamanho / 2) {
                    Partida.gameOver();
                }
            }
            
            Partida.proximoJogador();
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
        frontFaces[i].style.background = "url('" + Mesa.cartas[i].src + "')";
        frontFaces[i].setAttribute("id", Mesa.cartas[i].id);
    }
}

