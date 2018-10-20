

/**
 * Enum
 */
var ModoJogo = {
  INDIVIDUAL: 0,
  GRUPO: 1
};

/**
 * Class
 */
var Carta = function(rootElement, frontFaceElement, backFaceElement, figura) {
  this.rootElement = rootElement;
  this.frontFaceElement = frontFaceElement;
  this.backFaceElement = backFaceElement;
  this.figura = figura;
};
Carta.prototype.virar = function() {
  
}


/**
 * Singleton class
 */
var Mesa = {
  cartas: [],
  
  cartasViradas: [],
  
  preencherMesa: function(tamanho) {
    var numeroCartas = tamanho * tamanho;
    var numeroPares = tamanho * 2;
    
    Mesa.cartas = [];
    
    for (var i = 0; i < numeroCartas; i++) {
      var figura = {
        src: "../img/" + (i % numeroPares) + ".jpg",
        id: i % (Partida.tamanho)
      };
      
      var rootElement = document.createElement("div");
      rootElement.setAttribute("class", "carta");
      rootElement.setAttribute("id", "carta" + i);

      rootElement.addEventListener("click", function() {
        Mesa.virarCarta(this);
      }, false);

      var backElement = document.createElement("div");
      backElement.setAttribute("class", "face Back");
      rootElement.appendChild(backElement);
      
      var frontElement = document.createElement("div");
      frontElement.setAttribute("class", "face Front");
      rootElement.appendChild(frontElement);
      
      var carta = new Carta(rootElement, frontElement, backElement, figura);
      
      Mesa.cartas.push(carta);
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
  },
  
  virarCarta: function(cartaElement) {
    if (Mesa.cartasViradas.length < 2) {  //vira duas cartas
        var faces = cartaElement.getElementsByClassName("face");
        //console.log(faces[0]); //faceBack
        if (faces[0].classList.length > 2) {
            return; //não permite que ao clicar duas vezes na mesma carta, ela desvira
        }
        faces[0].classList.toggle("virado"); //procura e desliga a face
        faces[1].classList.toggle("virado"); //procura e desliga a face
        Mesa.cartasViradas.push(cartaElement);
        
        if (Mesa.cartasViradas.length === 2) {
            if (Mesa.cartasViradas[0].childNodes[1].id === Mesa.cartasViradas[1].childNodes[1].id) {  //acertou duas cartas
                Mesa.cartasViradas[0].childNodes[0].classList.toggle("acertou");
                Mesa.cartasViradas[0].childNodes[1].classList.toggle("acertou");
                Mesa.cartasViradas[1].childNodes[0].classList.toggle("acertou");
                Mesa.cartasViradas[1].childNodes[1].classList.toggle("acertou");

                Partida.jogadores[Partida.jogadorAtual].acertos++;
                
                Mesa.cartasViradas = [];
                
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
        Mesa.cartasViradas[0].childNodes[0].classList.toggle("virado"); //no terceiro clique desvira as cartas viradas
        Mesa.cartasViradas[0].childNodes[1].classList.toggle("virado");
        Mesa.cartasViradas[1].childNodes[0].classList.toggle("virado");
        Mesa.cartasViradas[1].childNodes[1].classList.toggle("virado");

        Mesa.cartasViradas = [];
    }

  },
  
  limparMesa: function() {
    Mesa.cartasViradas = [];
    
    var frontFaces = document.getElementsByClassName("Front");
    var backFaces = document.getElementsByClassName("Back");
    for (var i = 0; i < frontFaces.length; i++) {
        frontFaces[i].classList.remove("virado", "acertou");
        backFaces[i].classList.remove("virado", "acertou");
    }
  },
  
  gerarCartas: function(tamanho) {
    var cartasElement = document.getElementById("cartas");
    cartasElement.innerHTML = "";
    
    for (var linha = 0; linha < tamanho; linha++) {
        var linhaElement = document.createElement("div");
        
        for(var coluna = 0; coluna < tamanho; coluna++) {
            var carta = Mesa.cartas[linha * tamanho + coluna];
            
            linhaElement.appendChild(carta.rootElement);
        }
       
       cartasElement.appendChild(linhaElement);
    }
    
    document.body.appendChild(document.getElementById("tabuleiro"));
    
    // muda a frente das cartas por uma imagem
    var frontFaces = document.getElementsByClassName("Front");
    for (var i = 0; i < frontFaces.length; i++) {
        frontFaces[i].style.background = "url('" + Mesa.cartas[i].figura.src + "')";
        frontFaces[i].setAttribute("id", Mesa.cartas[i].figura.id);
    }
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
    
    Mesa.limparMesa();
    
    if(Partida.tamanho <= 0) {
      return;
    }
    
    var inicioJogo = document.querySelector("#inicio");
    var gameOver = document.querySelector("#GameOver");
    inicioJogo.style.zIndex = -2; //coloca div inicio atras e tabuleiro na frente
    gameOver.style.zIndex = -2; //coloca div GameOver atras
    
    Mesa.embaralhar();
    
    Mesa.gerarCartas(Partida.tamanho);
    
    Partida.state = GameState.RUNNING;
  },
  
  reiniciarJogo: function() {
    Partida.iniciarJogo();
  },
  
  gameOver: function() {
    Partida.state = GameState.NOT_RUNNING;
    
    var fimJogo = document.querySelector("#GameOver");
    //var inicioJogo = document.querySelector("#inicio");
    fimJogo.style.zIndex = 10; //coloca div GameOver na frente 
    Partida.mostrarResultado(); //seta valores do resultado
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
  },
  
  mostrarResultado: function() {
    var nomeJgVencedor = document.getElementById("nomeJgVencedor");
    var nomeJogador = document.getElementById("nome1").value;
    if (Partida.modoJogo == ModoJogo.GRUPO) {
      var nomeJogador2 = document.getElementById("nome2").value;
    }
    document.getElementById("nomeJgVencedor").value = nomeJogador;
    document.getElementById("dimEscolhida").value = Partida.tamanho + "x" + Partida.tamanho;
    document.getElementById("modoEscolhido").value = Partida.modoJogo == ModoJogo.INDIVIDUAL? "Individual" : "Grupo";
    document.getElementById("totalPontos").value = "testando";
    document.getElementById("totalTempo").value = "testando";
  }

};



