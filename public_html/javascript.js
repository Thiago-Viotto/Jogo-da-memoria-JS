

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
var Historico = {
  registros: []
};

/**
 * Class
 */
var RegistroHistorico = function(nomeVencedor, dimensao, modoJogo, pontosVencedor, tempoPartida) {
  this.nomeVencedor = nomeVencedor;
  this.dimensao = dimensao;
  this.modoJogo = modoJogo;
  this.pontosVencedor = pontosVencedor;
  this.tempoPartida = tempoPartida;
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
  this.exibida = false;
  this.identificador = identificador;
};
Carta.prototype.virar = function() {
  if(!this.virada) {
    this.virada = true;
    this.frontFaceElement.classList.add("virado");
    this.backFaceElement.classList.add("virado");
  }
}
Carta.prototype.exibir = function() {
  if(!this.virada) {
    this.exibida = true;
    this.frontFaceElement.classList.add("virado");
    this.backFaceElement.classList.add("virado");
  }
}
Carta.prototype.desvirar = function() {
  if(this.virada) {
    this.virada = false;
    this.frontFaceElement.classList.remove("virado");
    this.backFaceElement.classList.remove("virado");
  }
}
Carta.prototype.ocultar = function() {
  if(this.exibida) {
    this.exibida = false;
    this.frontFaceElement.classList.remove("virado");
    this.backFaceElement.classList.remove("virado");
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
      var identificador = i % (Partida.tamanho * Partida.tamanho / 2);
      
      var imgSrc = "img/cartas/" + identificador + ".jpg";
      
      var rootElement = document.createElement("div");
      rootElement.setAttribute("class", "carta");

      var backElement = document.createElement("div");
      backElement.setAttribute("class", "face Back");
      rootElement.appendChild(backElement);
      
      var frontElement = document.createElement("div");
      frontElement.setAttribute("class", "face Front");
      frontElement.style.backgroundImage = "url('" + imgSrc + "')";
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
  
  exibirCartasOcultas: function() {
    Mesa.desabilitarBotoesAoExibir();
    for(var c of Mesa.cartas) {
      c.exibir();
    }  
  },

  desabilitarBotoesAoExibir: function() {
    document.getElementById("btn5").disabled = true;
    document.getElementById("btn6").disabled = true;
    document.getElementById("btn7").disabled = true;
    document.getElementById("btnIniciar2").disabled = true;
    document.getElementById("btnMostrarCartas").disabled = true;
    document.getElementById("btnOcultarCartas").disabled = false;
  },

  ocultarCartasExibidas: function() {
    Mesa.habilitarBotoesAoOcultar();
    for(var c of Mesa.cartas) {
      c.ocultar();
    }  
  },

  habilitarBotoesAoOcultar: function() {
    document.getElementById("btn5").disabled = false;
    document.getElementById("btn6").disabled = false;
    document.getElementById("btn7").disabled = false;
    document.getElementById("btnIniciar2").disabled = false;
    document.getElementById("btnMostrarCartas").disabled = false;
    document.getElementById("btnOcultarCartas").disabled = true;
  },

  virarCarta: function(carta) {
    var estavaVirada = carta.estaVirada();
    
    if (Mesa.cartasViradas.length >= 2) {
        
        for(var c of Mesa.cartasViradas) {
          c.desvirar();
        }

        Mesa.cartasViradas = [];
        
        if(estavaVirada) {
          return;
        }
    }
    
    if(carta.estaVirada()) {
      return;
    }
    
    carta.virar();
    
    Mesa.cartasViradas.push(carta);
    
    if (Mesa.cartasViradas.length === 2) {
      // No modo individual, cada jogada é um ponto para o jogador
      if (Partida.modoJogo == ModoJogo.INDIVIDUAL) {
        Partida.jogadores[Partida.jogadorAtual].pontos++;
      }
      
      if (Mesa.cartasViradas[0].identificador === Mesa.cartasViradas[1].identificador) {
          //acertou duas cartas
          Mesa.cartasViradas[0].realcar();
          Mesa.cartasViradas[1].realcar();

          // No modo grupo, cada acerto é um ponto para o jogador
          Partida.jogadores[Partida.jogadorAtual].acertos++;
          if (Partida.modoJogo == ModoJogo.GRUPO) {
            Partida.jogadores[Partida.jogadorAtual].pontos++;
          }
          
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
        linhaElement.style.whiteSpace = "nowrap";
        
        for(var coluna = 0; coluna < tamanho; coluna++) {
            var carta = Mesa.cartas[linha * tamanho + coluna];
            
            var zoomJanela = 1;
            
            if(window.innerWidth < 600) {
              zoomJanela = 0.6;
            }
            
            carta.rootElement.style.zoom = 2 / (tamanho / 1.4) * zoomJanela;
            
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
  this.pontos = 0;
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
  tempoInicial: 0,
  tempoFinal: 0,
  
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
  
  iniciarJogo: function(fullscreen) {
    if(fullscreen) {
      var app = document.getElementById("app");
      var m = app.requestFullScreen || app.webkitRequestFullScreen || app.mozRequestFullScreen;
      if(m) m.call(app);
    }
    
    Partida.jogadores = [];
    Partida.tempoInicial = new Date();
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

    Mesa.habilitarBotoesAoOcultar();
    
    Partida.state = GameState.RUNNING;
  },
  
  reiniciarJogo: function() {
    Partida.iniciarJogo(false);
  },
  
  gameOver: function() {
    Partida.state = GameState.NOT_RUNNING;
    Partida.tempoFinal = new Date();
        
    setTimeout(function() {
      ControladorTelas.exibirResultado();
      
      Partida.preencherResultado();
    }, 1500);
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
      if(jogador.pontos >= maiorPontuacao) {
        maiorPontuacao = jogador.pontos;
        jogadorMaiorPontuacao = jogador;
      }
    }
    
    var nomeJgVencedor = jogadorMaiorPontuacao.nome;
    
    var nomeJogador = Partida.jogadores[0].nome;
    if (Partida.modoJogo == ModoJogo.GRUPO) {
      var nomeJogador2 = Partida.jogadores[1].nome;
    }
    
    var tempoPartida = ((Partida.tempoFinal.getTime() - Partida.tempoInicial.getTime()) / 1000).toFixed(2);
    Historico.registros.reverse();
    Historico.registros.push(new RegistroHistorico(nomeJgVencedor, Partida.tamanho, Partida.modoJogo, jogadorMaiorPontuacao.pontos, tempoPartida));
    Historico.registros.reverse();

    var divHistorico = document.getElementById("historicoResultado");
    divHistorico.innerHTML = "";
    
    var first = true;
    var addedTitle = false;
    
    for(historico of Historico.registros) {
        if(!first) {
          if(!addedTitle) {
            divHistorico.innerHTML += "<h2>Histórico:</h2>";
            addedTitle = true;
          }
          divHistorico.innerHTML += "<hr>";
        }
        
        divHistorico.innerHTML += "<p class='paragrafo'>Nome do jogador vencedor: </p><input type='text' value='" + historico.nomeVencedor + "' readonly/>";
        divHistorico.innerHTML += "<p class='paragrafo'>Dimensões do tabuleiro: </p><input type='text' value='" + historico.dimensao + "' readonly/>";
        divHistorico.innerHTML += "<p class='paragrafo'>Modo de jogo: </p><input type='text' value='" + (Partida.modoJogo == ModoJogo.INDIVIDUAL? "Individual" : "Grupo") + "' readonly/>";
        divHistorico.innerHTML += "<p class='paragrafo'>Total de pontos do vencedor: </p><input type='text' value='" + historico.pontosVencedor + "' readonly/>";
        divHistorico.innerHTML += "<p class='paragrafo'>Total de tempo gasto na partida: </p><input type='text' value='" + historico.tempoPartida + " segundos' readonly/>";
        
        first = false;
    }
    
  }

};


window.addEventListener("load", function() {
  ControladorTelas.exibirInicio();
});




