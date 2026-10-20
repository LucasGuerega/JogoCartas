// ============================================================
// MECÂNICA DO JOGO
// Duplas: um LEITOR lê as dicas e o outro ADIVINHA.
// Cada carta tem 6 dicas. Acertou na dica 1 = anda 6 casas,
// na dica 2 = 5 casas ... na dica 6 = 1 casa.
// ============================================================

const EQUIPES_INFO = [
    { nome: 'Equipe Vermelha', cor: '#e74c3c' },
    { nome: 'Equipe Azul', cor: '#3498db' }
];
const MAX_DICAS = 6;

let estado = null;   // SÓ NO HOST: estado completo (inclui a carta com a resposta)
let visao = null;    // todos: o que ESTE jogador pode ver (sem segredos)
let baralho = [];    // SÓ NO HOST

// ------------------------------------------------------------
// ESTADO (host)
// ------------------------------------------------------------
function novoEstado() {
    return {
        fase: 'lobby',          // 'lobby' | 'jogando' | 'fim'
        tamanho: 40,            // casas do tabuleiro
        jogadores: [],          // { id, nome, equipe: 0|1|null, online }
        posicoes: [0, 0],       // casa de cada equipe
        contTurnos: [0, 0],     // quantas vezes cada equipe já jogou (para alternar leitor)
        turno: null,            // { equipe, leitorId, adivinhadorId, dica, resultado, pontos, carta }
        vencedor: null
    };
}

function iniciarComoHost(nome) {
    estado = novoEstado();
    estado.jogadores.push({ id: meuId, nome: nome, equipe: null, online: true });
    log('Sala criada! Código: ' + codigoSala);
    publicar();
}

// Monta o que cada jogador pode ver. Só o leitor enxerga a resposta e as dicas futuras;
// quando a rodada termina, todos veem a carta completa.
function estadoPara(id) {
    const v = {
        fase: estado.fase,
        tamanho: estado.tamanho,
        jogadores: estado.jogadores,
        posicoes: estado.posicoes,
        vencedor: estado.vencedor,
        turno: null
    };
    const t = estado.turno;
    if (t) {
        const veTudo = t.leitorId === id || t.resultado !== null;
        v.turno = {
            equipe: t.equipe,
            leitorId: t.leitorId,
            adivinhadorId: t.adivinhadorId,
            dica: t.dica,
            resultado: t.resultado,
            pontos: t.pontos,
            categoria: t.carta.categoria,
            dicas: veTudo ? t.carta.dicas.slice() : t.carta.dicas.slice(0, t.dica),
            resposta: veTudo ? t.carta.resposta : null
        };
    }
    return v;
}

// Atualiza a tela do host e envia a visão personalizada para cada jogador
function publicar() {
    visao = estadoPara(meuId);
    renderizar();
    conexoes.forEach((c) => {
        if (c.open) c.send({ tipo: 'ESTADO', estado: estadoPara(c.peer) });
    });
}

// Escreve no histórico do host e de todos os jogadores
function anunciar(msg) {
    log(msg);
    conexoes.forEach((c) => {
        if (c.open) c.send({ tipo: 'LOG', msg: msg });
    });
}

// ------------------------------------------------------------
// MENSAGENS RECEBIDAS
// ------------------------------------------------------------
function tratarMensagemCliente(d) {
    if (!d) return;
    if (d.tipo === 'ESTADO') {
        visao = d.estado;
        renderizar();
    } else if (d.tipo === 'LOG') {
        log(String(d.msg));
    }
}

// O host decide tudo. "id" vem da conexão (não do conteúdo da mensagem), então não dá para se passar por outro jogador.
function tratarMensagemHost(id, d) {
    if (!d || typeof d.tipo !== 'string' || !estado) return;

    const ehDono = id === meuId;
    const j = estado.jogadores.find((x) => x.id === id);
    const t = estado.turno;
    const ehLeitor = !!(t && t.leitorId === id);

    switch (d.tipo) {
        case 'ENTRAR': {
            const nome = String(d.nome || '').trim().slice(0, 20) || 'Jogador';
            if (!j) {
                estado.jogadores.push({ id: id, nome: nome, equipe: null, online: true });
                anunciar(nome + ' entrou na mesa.');
            }
            break;
        }

        case 'ESCOLHER_EQUIPE': {
            if (!j || (d.equipe !== 0 && d.equipe !== 1)) return;
            // não troca de equipe no meio da própria rodada
            if (estado.fase === 'jogando' && t && (t.leitorId === id || t.adivinhadorId === id)) return;
            j.equipe = d.equipe;
            break;
        }

        case 'TAMANHO': {
            if (!ehDono || estado.fase !== 'lobby') return;
            const n = parseInt(d.valor, 10);
            estado.tamanho = Math.min(100, Math.max(10, isNaN(n) ? 40 : n));
            break;
        }

        case 'INICIAR': {
            if (!ehDono || estado.fase !== 'lobby') return;
            if (!membrosOnline(0).length || !membrosOnline(1).length) {
                alert('Cada equipe precisa de pelo menos 1 jogador (o ideal são 2, uma dupla).');
                return;
            }
            comecarPartida();
            break;
        }

        case 'PROXIMA_DICA': {
            if (!ehLeitor || t.resultado !== null || t.dica >= MAX_DICAS) return;
            t.dica++;
            break;
        }

        case 'ACERTOU': {
            if (!ehLeitor || t.resultado !== null) return;
            t.resultado = 'acertou';
            t.pontos = MAX_DICAS + 1 - t.dica; // dica 1 = 6 casas ... dica 6 = 1 casa
            estado.posicoes[t.equipe] = Math.min(estado.tamanho, estado.posicoes[t.equipe] + t.pontos);
            anunciar(nomeEquipe(t.equipe) + ' acertou na dica ' + t.dica + ' e avança ' + t.pontos + ' casa(s)!');
            verificarVitoria(t.equipe);
            break;
        }

        case 'ERRADO': {
            if (!ehLeitor || t.resultado !== null) return;
            t.resultado = 'errou';
            t.pontos = 0;
            anunciar(nomeEquipe(t.equipe) + ' não acertou. Não avança.');
            break;
        }

        case 'CONTINUAR': {
            if (!(ehLeitor || ehDono) || !t || t.resultado === null || estado.fase !== 'jogando') return;
            iniciarTurno((t.equipe + 1) % 2);
            break;
        }

        case 'PULAR_VEZ': {
            if (!ehDono || estado.fase !== 'jogando' || !t) return;
            anunciar('O host pulou a vez.');
            iniciarTurno((t.equipe + 1) % 2);
            break;
        }

        case 'AJUSTAR': {
            if (!ehDono || estado.fase !== 'jogando') return;
            if (d.equipe !== 0 && d.equipe !== 1) return;
            const delta = d.delta > 0 ? 1 : -1;
            estado.posicoes[d.equipe] = Math.min(estado.tamanho, Math.max(0, estado.posicoes[d.equipe] + delta));
            anunciar('Host ajustou ' + nomeEquipe(d.equipe) + ' para a casa ' + estado.posicoes[d.equipe] + '.');
            verificarVitoria(d.equipe);
            break;
        }

        case 'NOVA_PARTIDA': {
            if (!ehDono) return;
            estado.fase = 'lobby';
            estado.turno = null;
            estado.vencedor = null;
            estado.posicoes = [0, 0];
            estado.contTurnos = [0, 0];
            anunciar('Voltando ao lobby.');
            break;
        }

        default:
            return;
    }

    publicar();
}

function aoJogadorSair(id) {
    if (!estado) return;
    const j = estado.jogadores.find((x) => x.id === id);
    if (!j) return;

    if (estado.fase === 'lobby') {
        estado.jogadores = estado.jogadores.filter((x) => x.id !== id);
    } else {
        j.online = false;
    }
    anunciar(j.nome + ' saiu da mesa.');

    // Se o leitor sumiu, ninguém consegue controlar a rodada: passa a vez
    const t = estado.turno;
    if (estado.fase === 'jogando' && t && t.leitorId === id) {
        iniciarTurno((t.equipe + 1) % 2);
    }
    publicar();
}

// ------------------------------------------------------------
// REGRAS (host)
// ------------------------------------------------------------
function nomeEquipe(eq) {
    return EQUIPES_INFO[eq].nome;
}

function membrosOnline(eq) {
    return estado.jogadores.filter((j) => j.equipe === eq && j.online);
}

function embaralhar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const k = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[k]] = [lista[k], lista[i]];
    }
    return lista;
}

function comprarCarta() {
    if (baralho.length === 0) baralho = embaralhar(CARTAS.slice());
    return baralho.pop();
}

function comecarPartida() {
    estado.fase = 'jogando';
    estado.posicoes = [0, 0];
    estado.contTurnos = [0, 0];
    estado.vencedor = null;
    baralho = embaralhar(CARTAS.slice());
    anunciar('A partida começou! Tabuleiro de ' + estado.tamanho + ' casas.');
    iniciarTurno(0);
}

// Começa a rodada da equipe indicada (ou da outra, se ela estiver sem jogadores online)
function iniciarTurno(equipe) {
    for (let k = 0; k < 2; k++) {
        const eq = (equipe + k) % 2;
        const membros = membrosOnline(eq);
        if (membros.length > 0) {
            const n = estado.contTurnos[eq]++;
            // alterna quem lê: na rodada seguinte da mesma equipe os papéis se invertem
            const leitor = membros[n % membros.length];
            const adivinhador = membros[(n + 1) % membros.length];
            estado.turno = {
                equipe: eq,
                leitorId: leitor.id,
                adivinhadorId: adivinhador.id,
                dica: 1,
                resultado: null,   // null | 'acertou' | 'errou'
                pontos: 0,
                carta: comprarCarta()
            };
            anunciar('Vez da ' + nomeEquipe(eq) + ': ' + leitor.nome + ' lê e ' + adivinhador.nome + ' adivinha.');
            return;
        }
    }
    estado.turno = null;
    estado.fase = 'lobby';
    anunciar('Não há jogadores online nas equipes. Voltando ao lobby.');
}

function verificarVitoria(eq) {
    if (estado.posicoes[eq] >= estado.tamanho) {
        estado.fase = 'fim';
        estado.vencedor = eq;
        anunciar(nomeEquipe(eq) + ' chegou ao fim do tabuleiro e venceu!');
    }
}

// ------------------------------------------------------------
// AÇÕES DOS BOTÕES
// ------------------------------------------------------------
function escolherEquipe(eq) { agir({ tipo: 'ESCOLHER_EQUIPE', equipe: eq }); }
function mudarTamanho() { agir({ tipo: 'TAMANHO', valor: $('input-tamanho').value }); }
function iniciarPartida() { agir({ tipo: 'INICIAR' }); }
function ajustar(eq, delta) { agir({ tipo: 'AJUSTAR', equipe: eq, delta: delta }); }

// ------------------------------------------------------------
// TELA
// ------------------------------------------------------------
function el(tag, texto, classe) {
    const e = document.createElement(tag);
    if (texto !== undefined && texto !== null) e.textContent = texto;
    if (classe) e.className = classe;
    return e;
}

function botao(texto, aoClicar, classe) {
    const b = el('button', texto, classe);
    b.onclick = aoClicar;
    return b;
}

function mostrar(id, visivel) {
    $(id).classList.toggle('oculto', !visivel);
}

function nomeJogador(j) {
    return j.nome + (j.id === meuId ? ' (você)' : '') + (j.online === false ? ' (offline)' : '');
}

function renderizar() {
    if (!visao) return;
    const emLobby = visao.fase === 'lobby';
    mostrar('tela-conexao', false);
    mostrar('tela-lobby', emLobby);
    mostrar('tela-jogo', !emLobby);
    if (emLobby) renderLobby();
    else renderJogo();
}

function renderLobby() {
    $('codigo-sala').textContent = codigoSala;

    [0, 1].forEach((eq) => {
        $('box-eq-' + eq).style.borderColor = EQUIPES_INFO[eq].cor;
        $('titulo-eq-' + eq).textContent = nomeEquipe(eq);
        const ul = $('lista-eq-' + eq);
        ul.innerHTML = '';
        visao.jogadores
            .filter((j) => j.equipe === eq)
            .forEach((j) => ul.appendChild(el('li', nomeJogador(j))));
    });

    const sem = visao.jogadores.filter((j) => j.equipe === null);
    $('lista-sem-equipe').textContent = sem.length ? sem.map(nomeJogador).join(', ') : '—';

    mostrar('config-host', ehHost);
    const campo = $('input-tamanho');
    if (ehHost && document.activeElement !== campo) campo.value = visao.tamanho;

    $('aviso-lobby').textContent = ehHost
        ? 'Quando as duas equipes estiverem prontas, clique em Iniciar partida.'
        : 'Escolha sua equipe e aguarde o host iniciar a partida.';
}

function renderJogo() {
    renderPlacar();
    renderTabuleiro();
    renderTurno();

    mostrar('ajustes-host', ehHost);
    $('aj-nome-0').textContent = nomeEquipe(0) + ': ';
    $('aj-nome-1').textContent = nomeEquipe(1) + ': ';
}

function renderPlacar() {
    const p = $('placar');
    p.innerHTML = '';
    [0, 1].forEach((eq) => {
        const item = el('div');
        const bolinha = el('span', null, 'bolinha');
        bolinha.style.background = EQUIPES_INFO[eq].cor;
        item.appendChild(bolinha);
        item.appendChild(document.createTextNode(
            nomeEquipe(eq) + ': casa ' + visao.posicoes[eq] + ' / ' + visao.tamanho
        ));
        p.appendChild(item);
    });
}

function renderTabuleiro() {
    const tab = $('tabuleiro');
    tab.innerHTML = '';
    for (let i = 0; i <= visao.tamanho; i++) {
        const casa = el('div', null, 'casa');
        if (i === 0) {
            casa.classList.add('largada');
            casa.appendChild(el('span', 'Início'));
        } else if (i === visao.tamanho) {
            casa.classList.add('chegada');
            casa.appendChild(el('span', '🏁'));
        } else {
            casa.appendChild(el('span', String(i)));
        }

        const peoes = el('div', null, 'peoes');
        [0, 1].forEach((eq) => {
            if (visao.posicoes[eq] === i) {
                const peao = el('span', null, 'peao');
                peao.style.background = EQUIPES_INFO[eq].cor;
                peoes.appendChild(peao);
            }
        });
        casa.appendChild(peoes);
        tab.appendChild(casa);
    }
}

function renderTurno() {
    const info = $('turno-info');
    const area = $('area-carta');
    info.innerHTML = '';
    area.innerHTML = '';

    const t = visao.turno;
    const achar = (id) => visao.jogadores.find((j) => j.id === id);

    // Fim de jogo
    if (visao.fase === 'fim') {
        info.appendChild(el('h2', 'Fim de jogo! ' + nomeEquipe(visao.vencedor) + ' venceu!'));
        if (ehHost) info.appendChild(botao('Nova partida', () => agir({ tipo: 'NOVA_PARTIDA' })));
        else info.appendChild(el('p', 'Aguardando o host iniciar uma nova partida...'));
    }

    if (!t) {
        mostrar('area-carta', false);
        return;
    }
    mostrar('area-carta', true);

    const leitor = achar(t.leitorId);
    const adivinhador = achar(t.adivinhadorId);
    const souLeitor = t.leitorId === meuId;
    const souAdivinhador = t.adivinhadorId === meuId;

    if (visao.fase === 'jogando') {
        const titulo = el('h3', 'Vez da ' + nomeEquipe(t.equipe));
        titulo.style.color = EQUIPES_INFO[t.equipe].cor;
        info.appendChild(titulo);
        info.appendChild(el('p', 'Leitor: ' + (leitor ? leitor.nome : '?') +
            ' · Adivinhador: ' + (adivinhador ? adivinhador.nome : '?')));

        let papel = 'Você está assistindo esta rodada.';
        if (souLeitor) papel = 'Você é o LEITOR: leia as dicas em voz alta para o seu parceiro.';
        else if (souAdivinhador) papel = 'Você é o ADIVINHADOR: descubra a resposta!';
        info.appendChild(el('p', papel, 'papel'));
    }

    // Carta
    const carta = el('div', null, 'carta-perfil');
    carta.appendChild(el('span', t.categoria, 'categoria'));

    for (let i = 0; i < MAX_DICAS; i++) {
        const valor = MAX_DICAS - i; // 1ª dica vale 6 ... 6ª vale 1
        const linha = el('div', null, 'dica');
        linha.appendChild(el('span', String(valor), 'pts'));

        if (i < t.dicas.length) {
            linha.classList.add(i < t.dica ? 'ativa' : 'futura');
            linha.appendChild(el('span', t.dicas[i]));
        } else {
            linha.classList.add('oculta');
            linha.appendChild(el('span', 'Dica ' + (i + 1) + ' ainda não revelada'));
        }
        carta.appendChild(linha);
    }

    if (t.resposta) {
        const rotulo = t.resultado === null ? 'Resposta (só você vê): ' : 'Resposta: ';
        carta.appendChild(el('div', rotulo + t.resposta, 'resposta'));
    }

    if (t.resultado === 'acertou') {
        carta.appendChild(el('div', 'Acertou na dica ' + t.dica + '! A equipe avança ' + t.pontos + ' casa(s).', 'resultado'));
    } else if (t.resultado === 'errou') {
        carta.appendChild(el('div', 'Ninguém acertou. A equipe não avança.', 'resultado'));
    }
    area.appendChild(carta);

    // Controles do leitor (e botão de continuar também para o host)
    const controles = el('div', null, 'controles');
    if (visao.fase === 'jogando') {
        if (souLeitor && t.resultado === null) {
            const proxima = botao(
                'Próxima dica (' + (t.dica + 1) + 'ª, vale ' + (MAX_DICAS - t.dica) + ')',
                () => agir({ tipo: 'PROXIMA_DICA' })
            );
            proxima.disabled = t.dica >= MAX_DICAS;
            controles.appendChild(proxima);
            controles.appendChild(botao('Acertou! (+' + (MAX_DICAS + 1 - t.dica) + ' casas)',
                () => agir({ tipo: 'ACERTOU' }), 'ok'));
            controles.appendChild(botao('Ninguém acertou',
                () => agir({ tipo: 'ERRADO' }), 'erro'));
        } else if (t.resultado !== null && (souLeitor || ehHost)) {
            controles.appendChild(botao('Continuar', () => agir({ tipo: 'CONTINUAR' })));
        } else if (t.resultado !== null) {
            controles.appendChild(el('p', 'Aguardando o leitor continuar...', 'ajuda'));
        }
    }
    area.appendChild(controles);
}