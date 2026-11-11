/**
 * Pokédex Didática & Acessível
 * JavaScript Vanilla (ES6+) consumindo PokéAPI e Web Speech API
 */

// Objeto de Internacionalização (i18n) para alternância dinâmica entre PT-BR e EN-US
const traducoes = {
  pt: {
    tituloApp: "Pokédex Acessível",
    linkAtalho: "Pular para o conteúdo principal",
    labelBusca: "Digite o nome ou ID do Pokémon:",
    placeholderBusca: "Ex: Pikachu ou 25",
    btnBuscar: "Buscar",
    btnTemaEscuro: "Escuro",
    btnTemaClaro: "Claro",
    btnVozOuvir: "Ouvir",
    btnVozParar: "Parar",
    tituloDescricao: "Descrição da Pokédex",
    tituloStatus: "Atributos Base",
    rotuloAltura: "Altura",
    rotuloPeso: "Peso",
    direitosRodape: "© 2026 Pokédex Acessível — Projeto Didático.",
    buscando: "Buscando dados na PokéAPI...",
    naoEncontrado: "Pokémon não encontrado! Verifique a grafia e tente novamente.",
    erroRede: "Erro de conexão ao carregar os dados. Verifique sua rede.",
    sucessoLeitura: "Dados carregados para o Pokémon "
  },
  en: {
    tituloApp: "Accessible Pokédex",
    linkAtalho: "Skip to main content",
    labelBusca: "Enter Pokémon name or ID:",
    placeholderBusca: "Ex: Pikachu or 25",
    btnBuscar: "Search",
    btnTemaEscuro: "Dark",
    btnTemaClaro: "Light",
    btnVozOuvir: "Listen",
    btnVozParar: "Stop",
    tituloDescricao: "Pokédex Description",
    tituloStatus: "Base Stats",
    rotuloAltura: "Height",
    rotuloPeso: "Weight",
    direitosRodape: "© 2026 Accessible Pokédex — Educational Project.",
    buscando: "Fetching data from PokéAPI...",
    naoEncontrado: "Pokémon not found! Please check spelling and try again.",
    erroRede: "Network error loading data. Please check your connection.",
    sucessoLeitura: "Data loaded for Pokémon "
  }
};

// Mapa de cores temáticas dos tipos de Pokémon para alto contraste visual
const coresTipos = {
  normal: '#9da0aa',
  fire: '#fd7d24',
  water: '#4592c4',
  grass: '#62b957',
  electric: '#eed535',
  ice: '#61cec0',
  fighting: '#d56723',
  poison: '#b97fc9',
  ground: '#ab9842',
  flying: '#3dc7ef',
  psychic: '#f366b9',
  bug: '#729f3f',
  rock: '#a38c21',
  ghost: '#7b62a3',
  dragon: '#0f6ac0',
  steel: '#9eb7b8',
  dark: '#707070',
  fairy: '#fdb9e9'
};

// Estado global da aplicação
let idiomaAtual = 'pt';
let descricaoAtualParaVoz = '';
let sintetizadorVoz = window.speechSynthesis;

// Captura das referências aos elementos do DOM
const formBusca = document.getElementById('formBusca');
const inputBusca = document.getElementById('inputBusca');
const statusRegiao = document.getElementById('statusRegiao');
const nomePokemon = document.getElementById('nomePokemon');
const numeroPokemon = document.getElementById('numeroPokemon');
const imagemPokemon = document.getElementById('imagemPokemon');
const containerTipos = document.getElementById('containerTipos');
const descricaoPokemon = document.getElementById('descricaoPokemon');
const valorAltura = document.getElementById('valorAltura');
const valorPeso = document.getElementById('valorPeso');
const containerBarrasStatus = document.getElementById('containerBarrasStatus');
const btnVoz = document.getElementById('btnVoz');
const iconeVoz = document.getElementById('iconeVoz');
const txtBtnVoz = document.getElementById('txtBtnVoz');
const btnTema = document.getElementById('btnTema');
const iconeTema = document.getElementById('iconeTema');
const txtBtnTema = document.getElementById('txtBtnTema');
const btnIdioma = document.getElementById('btnIdioma');
const txtBtnIdioma = document.getElementById('txtBtnIdioma');

// Elementos de texto traduzíveis da interface
const txtTituloApp = document.getElementById('txtTituloApp');
const linkAtalho = document.getElementById('linkAtalho');
const labelBusca = document.getElementById('labelBusca');
const txtBtnBuscar = document.getElementById('txtBtnBuscar');
const txtTituloDescricao = document.getElementById('txtTituloDescricao');
const txtTituloStatus = document.getElementById('txtTituloStatus');
const txtRotuloAltura = document.getElementById('txtRotuloAltura');
const txtRotuloPeso = document.getElementById('txtRotuloPeso');
const txtDireitosRodape = document.getElementById('txtDireitosRodape');

/**
 * Atualiza os textos da interface conforme o idioma selecionado
 */
function aplicarTextosIdioma() {
  const t = traducoes[idiomaAtual];
  txtTituloApp.textContent = t.tituloApp;
  linkAtalho.textContent = t.linkAtalho;
  labelBusca.textContent = t.labelBusca;
  inputBusca.placeholder = t.placeholderBusca;
  txtBtnBuscar.textContent = t.btnBuscar;
  txtTituloDescricao.textContent = t.tituloDescricao;
  txtTituloStatus.textContent = t.tituloStatus;
  txtRotuloAltura.textContent = t.rotuloAltura;
  txtRotuloPeso.textContent = t.rotuloPeso;
  txtDireitosRodape.textContent = t.direitosRodape;
  txtBtnIdioma.textContent = idiomaAtual === 'pt' ? 'EN' : 'PT';
  atualizarTextoBotaoTema();
}

/**
 * Atualiza o texto do botão de tema de acordo com o idioma ativo
 */
function atualizarTextoBotaoTema() {
  const isDark = document.body.classList.contains('dark-mode');
  const t = traducoes[idiomaAtual];
  iconeTema.textContent = isDark ? '☀️' : '🌙';
  txtBtnTema.textContent = isDark ? t.btnTemaClaro : t.btnTemaEscuro;
}

/**
 * Alterna entre tema claro e tema escuro
 */
function alternarTema() {
  document.body.classList.toggle('dark-mode');
  const estaEscuro = document.body.classList.contains('dark-mode');
  localStorage.setItem('pokedex-tema', estaEscuro ? 'escuro' : 'claro');
  atualizarTextoBotaoTema();
}

/**
 * Alterna o idioma do aplicativo entre Português e Inglês
 */
function alternarIdioma() {
  idiomaAtual = idiomaAtual === 'pt' ? 'en' : 'pt';
  localStorage.setItem('pokedex-idioma', idiomaAtual);
  aplicarTextosIdioma();
  // Se houver um Pokémon carregado, recarrega para sincronizar os dados no novo idioma
  const idOuNome = numeroPokemon.textContent.replace('#', '') || '1';
  buscarDadosPokemon(idOuNome);
}

/**
 * Função assíncrona principal para consumir a PokéAPI
 * @param {string} consulta - Nome ou ID do Pokémon
 */
async function buscarDadosPokemon(consulta) {
  // Limpa o termo de busca (converte para minúsculas e remove espaços vazios)
  const termoFormatado = String(consulta).trim().toLowerCase();
  if (!termoFormatado) return;

  // Interrompe qualquer narração de voz anterior em andamento
  if (sintetizadorVoz) sintetizadorVoz.cancel();
  txtBtnVoz.textContent = traducoes[idiomaAtual].btnVozOuvir;
  iconeVoz.textContent = '🔊';

  // Informa aos leitores de tela que a busca começou
  statusRegiao.textContent = traducoes[idiomaAtual].buscando;

  try {
    // 1. Busca os dados de estatísticas, tipos e imagem no endpoint /pokemon/
    const respPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${termoFormatado}`);
    if (!respPokemon.ok) throw new Error('PokemonNãoEncontrado');
    const dadosPokemon = await respPokemon.json();

    // 2. Busca os dados de espécie e descrições no endpoint /pokemon-species/
    const respEspecie = await fetch(dadosPokemon.species.url);
    let dadosEspecie = null;
    if (respEspecie.ok) {
      dadosEspecie = await respEspecie.json();
    }

    // Renderiza todos os dados capturados na tela
    renderizarPokemon(dadosPokemon, dadosEspecie);

    // Anuncia sucesso aos leitores de tela
    statusRegiao.textContent = `${traducoes[idiomaAtual].sucessoLeitura} ${dadosPokemon.name}.`;

  } catch (erro) {
    console.error("Erro na busca:", erro);
    const mensagemErro = erro.message === 'PokemonNãoEncontrado' 
      ? traducoes[idiomaAtual].naoEncontrado 
      : traducoes[idiomaAtual].erroRede;

    statusRegiao.textContent = mensagemErro;
    descricaoPokemon.textContent = mensagemErro;
    alert(mensagemErro);
  }
}

/**
 * Atualiza os elementos visuais do Card com as informações obtidas
 */
function renderizarPokemon(dados, especie) {
  // Nome e número formatado com preenchimento de zeros à esquerda (ex: #001)
  nomePokemon.textContent = dados.name;
  numeroPokemon.textContent = `#${String(dados.id).padStart(3, '0')}`;

  // Imagem frontal oficial de alta resolução
  const urlImagem = dados.sprites.other['official-artwork'].front_default 
    || dados.sprites.front_default 
    || 'https://via.placeholder.com/200?text=Sem+Imagem';
  imagemPokemon.src = urlImagem;
  imagemPokemon.alt = `${dados.name} em posição de batalha`;

  // Renderização dinâmica dos tipos
  containerTipos.innerHTML = '';
  dados.types.forEach(item => {
    const spanTipo = document.createElement('span');
    spanTipo.className = 'badge-tipo';
    spanTipo.textContent = item.type.name;
    spanTipo.style.backgroundColor = coresTipos[item.type.name] || '#777777';
    containerTipos.appendChild(spanTipo);
  });

  // Filtra e limpa a descrição textual oficial no idioma correspondente
  let textoLore = 'Descrição não disponível no momento.';
  if (especie && especie.flavor_text_entries) {
    const entradaIdioma = especie.flavor_text_entries.find(
      entry => entry.language.name === (idiomaAtual === 'pt' ? 'es' : 'en') // Espanhol como fallback próximo ao PT na PokeAPI
    ) || especie.flavor_text_entries.find(entry => entry.language.name === 'en');

    if (entradaIdioma) {
      // Remove quebras de linha indesejadas e caracteres especiais do texto da ROM
      textoLore = entradaIdioma.flavor_text.replace(/[\n\f]/g, ' ');
    }
  }

  descricaoPokemon.textContent = textoLore;
  descricaoAtualParaVoz = `${dados.name}. ${textoLore}`;

  // Conversão de medidas: Altura (decímetros para metros) e Peso (hectogramas para quilogramas)
  valorAltura.textContent = `${(dados.height / 10).toFixed(1)} m`;
  valorPeso.textContent = `${(dados.weight / 10).toFixed(1)} kg`;

  // Renderização das barras de status com cálculo percentual relativo (limite base de 255)
  containerBarrasStatus.innerHTML = '';
  dados.stats.forEach(st => {
    const porcentagem = Math.min(Math.round((st.base_stat / 255) * 100), 100);

    const linha = document.createElement('div');
    linha.className = 'linha-status';

    const spanNome = document.createElement('span');
    spanNome.className = 'nome-status';
    spanNome.textContent = traduzirNomeStatus(st.stat.name);

    const spanValor = document.createElement('span');
    spanValor.className = 'valor-status';
    spanValor.textContent = st.base_stat;

    const trilho = document.createElement('div');
    trilho.className = 'trilho-progresso';
    trilho.setAttribute('role', 'progressbar');
    trilho.setAttribute('aria-valuenow', st.base_stat);
    trilho.setAttribute('aria-valuemin', '0');
    trilho.setAttribute('aria-valuemax', '255');
    trilho.setAttribute('aria-label', `${spanNome.textContent}: ${st.base_stat}`);

    const preenchimento = document.createElement('div');
    preenchimento.className = 'preenchimento-progresso';
    preenchimento.style.width = `${porcentagem}%`;

    trilho.appendChild(preenchimento);
    linha.appendChild(spanNome);
    linha.appendChild(spanValor);
    linha.appendChild(trilho);

    containerBarrasStatus.appendChild(linha);
  });
}

/**
 * Traduz e abrevia os nomes técnicos dos atributos para exibição limpa
 */
function traduzirNomeStatus(nome) {
  const mapa = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'SP.ATK',
    'special-defense': 'SP.DEF',
    speed: 'SPD'
  };
  return mapa[nome] || nome;
}

/**
 * Controla a síntese de voz nativa da Web Speech API
 */
function alternarLeituraVoz() {
  if (!('speechSynthesis' in window)) {
    alert("Seu navegador não oferece suporte para síntese de voz (Web Speech API).");
    return;
  }

  // Se já estiver falando, pausa/cancela
  if (sintetizadorVoz.speaking) {
    sintetizadorVoz.cancel();
    txtBtnVoz.textContent = traducoes[idiomaAtual].btnVozOuvir;
    iconeVoz.textContent = '🔊';
    return;
  }

  if (!descricaoAtualParaVoz) return;

  // Cria a locução de voz
  const utterance = new SpeechSynthesisUtterance(descricaoAtualParaVoz);
  utterance.lang = idiomaAtual === 'pt' ? 'pt-BR' : 'en-US';
  utterance.rate = 1.0; // Velocidade de fala padrão
  utterance.pitch = 1.0; // Tom padrão

  // Feedback visual durante a narração
  utterance.onstart = () => {
    txtBtnVoz.textContent = traducoes[idiomaAtual].btnVozParar;
    iconeVoz.textContent = '⏹️';
  };

  utterance.onend = () => {
    txtBtnVoz.textContent = traducoes[idiomaAtual].btnVozOuvir;
    iconeVoz.textContent = '🔊';
  };

  utterance.onerror = () => {
    txtBtnVoz.textContent = traducoes[idiomaAtual].btnVozOuvir;
    iconeVoz.textContent = '🔊';
  };

  sintetizadorVoz.speak(utterance);
}

// Escuta a submissão do formulário de busca
formBusca.addEventListener('submit', (evento) => {
  evento.preventDefault();
  buscarDadosPokemon(inputBusca.value);
});

// Eventos de clique nos controles de tema, idioma e voz
btnTema.addEventListener('click', alternarTema);
btnIdioma.addEventListener('click', alternarIdioma);
btnVoz.addEventListener('click', alternarLeituraVoz);

// Inicialização da aplicação ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  // Restaura preferências salvas no localStorage
  const temaSalvo = localStorage.getItem('pokedex-tema');
  if (temaSalvo === 'escuro') {
    document.body.classList.add('dark-mode');
  }

  const idiomaSalvo = localStorage.getItem('pokedex-idioma');
  if (idiomaSalvo && traducoes[idiomaSalvo]) {
    idiomaAtual = idiomaSalvo;
  }

  aplicarTextosIdioma();

  // Carrega o Pokémon inicial (Bulbasaur #1)
  buscarDadosPokemon('1');
});