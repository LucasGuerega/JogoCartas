        let peer = null;
        let conexoes = []; // Guarda a lista de conexões com outros jogadores
        let ehHost = false;

        const statusEl = document.getElementById('status');
        const meuIdEl = document.getElementById('meu-id');
        const historicoEl = document.getElementById('historico');

        function log(mensagem) {
            historicoEl.innerHTML += `> ${mensagem}<br>`;
            historicoEl.scrollTop = historicoEl.scrollHeight;
        }

        // --- CRIAR SALA (HOST) ---
        function criarSala() {
            // Cria um ID de sala simples (ex: sala-8392)
            const idGerado = 'sala-' + Math.floor(1000 + Math.random() * 9000);
            const nomeJogador = document.getElementById('id-player').value.trim();
            if (!nomeJogador) {
                alert('Digite seu nome!');
                return;
            }
            peer = new Peer(idGerado);
            ehHost = true;
            

            peer.on('open', (id) => {
                statusEl.textContent = 'Sala Criada! Aguardando jogadores...';
                meuIdEl.textContent = id;
                log(`Sala criada com o ID: <b>${id}</b>`);
            });

            // Quando outro jogador tentar se conectar a esta sala:
            peer.on('connection', (conn) => {
                conexoes.push(conn);
                log(`Um novo jogador entrou na mesa!`);

                // Configura o escutador de eventos para esse novo jogador
                configurarConexao(conn);
            });
        }

        // --- ENTRAR EM UMA SALA EXISTENTE ---
        function entrarNaSala() {
            const idSala = document.getElementById('id-sala-input').value.trim();
            if (!idSala) {
                alert('Digite o ID da sala!');
                return;
            }
            const nomeJogador = document.getElementById('id-player').value.trim();
            if (!nomeJogador) {
                alert('Digite seu nome!');
                return;
            }
            log(`Testando conexão com a sala espere um pouco, <b>${nomeJogador}</b>`);
            peer = new Peer(); // Cria um ID aleatório para este jogador

            peer.on('open', (id) => {
                statusEl.textContent = 'Conectando à sala...';
                
                // Conecta diretamente ao Host usando o ID da sala informado
                const conn = peer.connect(idSala);
                conexoes.push(conn);

                conn.on('open', () => {
                    statusEl.textContent = 'Conectado à sala!';
                    meuIdEl.textContent = idSala;
                    log(`Você entrou na <b>${idSala}</b>`);
                });

                configurarConexao(conn);
            });
        }

        // --- CONFIGURA O RECEBIMENTO DE DADOS ---
        function configurarConexao(conn) {
            conn.on('data', (dados) => {
                if (dados.tipo === 'JOGADA') {
                    log(`${dados.nomeJogador}:  jogou <b>${dados.carta}</b>`);
                }

                // Se eu for o Host, repasso a jogada para TODOS os outros jogadores conectados
                if (ehHost) {
                    retransmitirParaOutros(conn, dados);
                }
            });

            conn.on('close', () => {
                log('${dados.nomeJogador} saiu da mesa.');
            });
        }

        // --- AÇÃO DE JOGAR UMA CARTA ---
        function jogarCarta(nomeCarta) {
            if (conexoes.length === 0) {
                alert('Você precisa criar ou entrar em uma sala primeiro!');
                return;
            }

            log(`Você jogou <b>${nomeCarta}</b>`);

            // Envia a jogada para os outros jogadores via P2P
            const nomeJogador = document.getElementById('id-player').value.trim() || 'Jogador Desconhecido';
            const pacote = { 
                tipo: 'JOGADA', 
                nomeJogador: nomeJogador, 
                carta: nomeCarta 
    };
                conexoes.forEach(c => c.send(pacote));
        }

        // --- FUNÇÃO DO HOST PARA RETRANSMITIR A TODOS ---
        function retransmitirParaOutros(conexaoRemetente, dados) {
            conexoes.forEach(c => {
                // Envia para todo mundo, exceto para quem originou a jogada
                if (c !== conexaoRemetente) {
                    c.send(dados);
                }
            });
        }

        