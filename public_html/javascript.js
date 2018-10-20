

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
var ControladorTelas = {
  exibirInicio: function() {
    document.getElementById("inicio").style.display = "block";
    document.getElementById("tabuleiro").style.display = "none";
    document.getElementById("GameOver").style.display = "none";
  },
  exibirTabuleiro: function() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("tabuleiro").style.display = "block";
    document.getElementById("GameOver").style.display = "none";
  },
  exibirResultado: function() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("tabuleiro").style.display = "block";
    document.getElementById("GameOver").style.display = "block";
  }
};

/**
 * Class
 */
var Carta = function(rootElement, frontFaceElement, backFaceElement, identificador) {
  this.rootElement = rootElement;
  this.frontFaceElement = frontFaceElement;
  this.backFaceElement = backFaceElement;
  this.virada = false;
  this.identificador = identificador;
};
Carta.prototype.virar = function() {
  if(!this.virada) {
    this.virada = true;
    
    var faces = this.rootElement.getElementsByClassName("face");
    
    faces[0].classList.toggle("virado"); //procura e desliga a face
    faces[1].classList.toggle("virado"); //procura e desliga a face
  }
}
Carta.prototype.desvirar = function() {
  if(this.virada) {
    this.virada = false;
    this.frontFaceElement.classList.toggle("virado");
    this.backFaceElement.classList.toggle("virado");
  }
}
Carta.prototype.estaVirada = function() {
  return this.virada;
}
Carta.prototype.removerRealce = function() {
  this.realcado = false;
  this.frontFaceElement.classList.remove("acertou");
}
Carta.prototype.realcar = function() {
  this.realcado = true;
  this.frontFaceElement.classList.add("acertou");
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
      var imgSrc = "../img/" + (i % numeroPares) + ".jpg";
      var identificador = i % (Partida.tamanho * Partida.tamanho / 2);
      
      var rootElement = document.createElement("div");
      rootElement.setAttribute("class", "carta");

      var backElement = document.createElement("div");
      backElement.setAttribute("class", "face Back");
      rootElement.appendChild(backElement);
      
      var frontElement = document.createElement("div");
      frontElement.setAttribute("class", "face Front");
      frontElement.style.background = "url('" + imgSrc + "')";
      rootElement.appendChild(frontElement);
      
      var carta = new Carta(rootElement, frontElement, backElement, identificador);

      // Declarando _carta dentro de uma função para manter seu valor em escopo isolado
      rootElement.addEventListener("click", (function() {
        var _carta = carta;
        return function() {
          Mesa.virarCarta(_carta);
        };
      })(), false);
      
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
  
  virarCarta: function(carta) {
    if (Mesa.cartasViradas.length >= 2) {  //vira duas cartas
        for(var carta of Mesa.cartasViradas) {
          carta.desvirar();
        }

        Mesa.cartasViradas = [];
        
        return;
    }
    
    if(carta.estaVirada()) {
      return;
    }
    
    carta.virar();
    
    Mesa.cartasViradas.push(carta);
    
    if (Mesa.cartasViradas.length === 2) {
      if (Mesa.cartasViradas[0].identificador === Mesa.cartasViradas[1].identificador) {
          //acertou duas cartas
          Mesa.cartasViradas[0].realcar();
          Mesa.cartasViradas[1].realcar();

          Partida.jogadores[Partida.jogadorAtual].acertos++;
          
          Mesa.cartasViradas = [];
          
          var acertos = 0;
          for(var jogador of Partida.jogadores) {
            acertos += jogador.acertos;
          }
          
          
          // se acertou todas as cartas
          if (acertos === Mesa.cartas.length / 2) {
              Partida.gameOver();
          }
      }
      
      Partida.proximoJogador();
    }

  },
  
  limparMesa: function() {
    Mesa.cartasViradas = [];
    
    for (var carta of Mesa.cartas) {
      carta.desvirar();
      carta.removerRealce();
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
    
    botao.style.backgroundColor = "#3cf";
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
    
    ControladorTelas.exibirTabuleiro();
    
    Mesa.embaralhar();
    
    Mesa.gerarCartas(Partida.tamanho);
    
    Partida.state = GameState.RUNNING;
  },
  
  reiniciarJogo: function() {
    Partida.iniciarJogo();
  },
  
  gameOver: function() {
    Partida.state = GameState.NOT_RUNNING;
    
    ControladorTelas.exibirResultado();
    
    Partida.preencherResultado(); //seta valores do resultado
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
  
  preencherResultado: function() {
    var maiorPontuacao = 0;
    var jogadorMaiorPontuacao = null;
    
    for(var jogador of Partida.jogadores) {
      if(jogador.acertos >= maiorPontuacao) {
        maiorPontuacao = jogador.acertos;
        jogadorMaiorPontuacao = jogador;
      }
    }
    
    var nomeJgVencedor = jogadorMaiorPontuacao.nome;
    
    var nomeJogador = Partida.jogadores[0].nome;
    if (Partida.modoJogo == ModoJogo.GRUPO) {
      var nomeJogador2 = Partida.jogadores[1].nome;
    }
    
    document.getElementById("nomeJgVencedor").value = nomeJogador;
    document.getElementById("dimEscolhida").value = Partida.tamanho + "x" + Partida.tamanho;
    document.getElementById("modoEscolhido").value = Partida.modoJogo == ModoJogo.INDIVIDUAL? "Individual" : "Grupo";
    document.getElementById("totalPontos").value = "testando";
    document.getElementById("totalTempo").value = "testando";
  }

};


window.addEventListener("load", function() {
  ControladorTelas.exibirInicio();
});



