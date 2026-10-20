// ============================================================
// CONEXÃO P2P (PeerJS)
// O host é a "fonte da verdade": os jogadores mandam ações para ele
// e ele devolve o estado atualizado para todo mundo.
// ============================================================
const PREFIXO_SALA = 'meujogocartas-'; // evita colisão de IDs no servidor público do PeerJS

let peer = null;
let conexoes = [];   // host: uma conexão por jogador | jogador comum: [conexão com o host]
let ehHost = false;
let meuId = null;
let codigoSala = '';

const $ = (id) => document.getElementById(id);
const statusEl = $('status');
const historicoEl = $('historico');

// Log em texto puro (textContent) para nomes de jogadores nunca virarem HTML
function log(mensagem) {
    const linha = document.createElement('div');
    linha.textContent = '> ' + mensagem;
    historicoEl.appendChild(linha);
    historicoEl.scrollTop = historicoEl.scrollHeight;
}

function lerNome() {
    const nome = $('id-player').value.trim();
    if (!nome) {
        alert('Digite seu nome!');
        return null;
    }
    return nome.slice(0, 20);
}

// --- CRIAR SALA (HOST) ---
function criarSala(tentativa = 0) {
    if (peer && tentativa === 0) return; // já está numa sala

    const nome = lerNome();
    if (!nome) return;

    const codigo = String(Math.floor(1000 + Math.random() * 9000));
    statusEl.textContent = 'Criando sala...';

    const novoPeer = new Peer(PREFIXO_SALA + codigo);
    peer = novoPeer;
    ehHost = true;
    let aberto = false;

    novoPeer.on('open', (id) => {
        aberto = true;
        meuId = id;
        codigoSala = codigo;
        statusEl.textContent = 'Sala criada!';
        iniciarComoHost(nome); // playMech.js
    });

    // Quando outro jogador tentar se conectar a esta sala:
    novoPeer.on('connection', (conn) => {
        conn.on('open', () => conexoes.push(conn));
        conn.on('data', (dados) => tratarMensagemHost(conn.peer, dados));
        conn.on('close', () => {
            conexoes = conexoes.filter((c) => c !== conn);
            aoJogadorSair(conn.peer);
        });
    });

    novoPeer.on('error', (err) => {
        if (aberto) {
            log('Erro de conexão: ' + err.type);
            return;
        }
        novoPeer.destroy();
        peer = null;
        ehHost = false;
        if (err.type === 'unavailable-id' && tentativa < 5) {
            criarSala(tentativa + 1); // código já em uso, sorteia outro
        } else {
            statusEl.textContent = 'Erro ao criar sala: ' + err.type;
        }
    });
}

// --- ENTRAR EM UMA SALA EXISTENTE ---
function entrarNaSala() {
    if (peer) return;

    const nome = lerNome();
    if (!nome) return;

    const codigo = $('id-sala-input').value.trim();
    if (!/^\d{4}$/.test(codigo)) {
        alert('Digite o código de 4 números da sala!');
        return;
    }

    statusEl.textContent = 'Conectando à sala...';
    ehHost = false;

    const novoPeer = new Peer(); // ID aleatório para este jogador
    peer = novoPeer;
    let conectou = false;

    function falhar(mensagem) {
        if (peer !== novoPeer) return; // tentativa já descartada
        statusEl.textContent = mensagem;
        novoPeer.destroy();
        peer = null;
        conexoes = [];
    }

    novoPeer.on('open', (id) => {
        meuId = id;
        codigoSala = codigo;

        const conn = novoPeer.connect(PREFIXO_SALA + codigo, { reliable: true });
        conexoes = [conn];

        conn.on('open', () => {
            conectou = true;
            statusEl.textContent = 'Conectado à sala!';
            conn.send({ tipo: 'ENTRAR', nome: nome });
        });

        conn.on('data', tratarMensagemCliente); // playMech.js

        conn.on('close', () => {
            alert('Você foi desconectado da sala.');
            location.reload();
        });

        setTimeout(() => {
            if (!conectou) falhar('Não foi possível conectar. Confira o código da sala.');
        }, 10000);
    });

    novoPeer.on('error', (err) => {
        if (conectou) {
            log('Erro de conexão: ' + err.type);
        } else if (err.type === 'peer-unavailable') {
            falhar('Sala não encontrada. Confira o código.');
        } else {
            falhar('Erro: ' + err.type);
        }
    });
}

// --- ENVIA UMA AÇÃO PARA O HOST (ou processa direto, se eu for o host) ---
function agir(dados) {
    if (ehHost) {
        tratarMensagemHost(meuId, dados);
    } else if (conexoes[0] && conexoes[0].open) {
        conexoes[0].send(dados);
    }
}