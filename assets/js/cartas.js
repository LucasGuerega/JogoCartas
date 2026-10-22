// ============================================================
// CARTAS DO JOGO
// Cada carta tem: categoria, resposta e exatamente 6 dicas.
// A ordem das dicas importa: a 1ª é a MAIS DIFÍCIL (vale 6 casas)
// e a 6ª é a MAIS FÁCIL (vale 1 casa).
//
// Estas cartas são só exemplos. Troque pelas suas!
// ============================================================
const CARTAS = [
    {
        categoria: "Pessoa",
        resposta: "David Manning White",
        dicas: [
            "Minha pesquisa é um marco nos estudos de seleção de notícias.",
            "Analisei como decisões individuais influenciam o noticiário.",
            "Meu estudo examinou o trabalho de um editor de jornal.",
            "Investiguei por que algumas notícias são selecionadas e outras descartadas.",
            "Meu estudo de caso foi publicado em 1950.",
            "Sou o pesquisador associado ao estudo clássico do gatekeeper na redação."
        ]
    },
    {
        categoria: "Pessoa",
        resposta: "Elisabeth Noelle-Neumann",
        dicas: [
            "Estudei a relação entre opinião pública e comportamento social[cite: 2].",
            "Minha teoria envolve o medo do isolamento[cite: 2].",
            "Investiguei por que algumas pessoas deixam de expressar suas opiniões[cite: 2].",
            "A percepção do que é majoritário tem papel importante no meu trabalho[cite: 2].",
            "Minha teoria foi formulada e difundida na década de 1970[cite: 2].",
            "Sou uma pesquisadora alemã conhecida pela teoria da espiral do silêncio[cite: 2]."
        ]
    },
    {
        categoria: "Pessoa",
        resposta: "Gaye Tuchman",
        dicas: [
            "Minha pesquisa contribuiu para os estudos sociológicos do jornalismo[cite: 3].",
            "Investiguei como as notícias são construídas no cotidiano[cite: 3].",
            "As rotinas produtivas são fundamentais para compreender meu trabalho[cite: 3].",
            "Analisei a produção de notícias como um processo social[cite: 3].",
            "Sou autora de Making News: A Study in the Construction of Reality[cite: 3].",
            "Meu sobrenome é Tuchman, e meu primeiro nome é Gaye[cite: 3]."
        ]
    },
    {
        categoria: "Teorias do Jornalismo",
        resposta: "Teoria do Espelho",
        dicas: [
            "Estou associada a uma concepção clássica do papel jornalístico[cite: 4].",
            "Essa concepção ganhou força com o ideal de objetividade[cite: 4].",
            "Defende a separação entre fatos e opiniões[cite: 4].",
            "A notícia deveria retratar a realidade de maneira fiel[cite: 4].",
            "Costuma ser representada pela metáfora de uma superfície refletora[cite: 4].",
            "Sou uma teoria sem um único criador reconhecido: qual é meu nome?[cite: 4]"
        ]
    },
    {
        categoria: "Pessoa",
        resposta: "Maxwell McCombs",
        dicas: [
            "Minha pesquisa relaciona comunicação e opinião pública[cite: 5].",
            "Investiguei a influência dos meios de comunicação sobre a importância atribuída aos assuntos[cite: 5].",
            "Meu estudo clássico ocorreu durante a eleição presidencial dos EUA de 1968[cite: 5].",
            "Trabalhei com a ideia de que a mídia pode influenciar sobre o que o público pensa[cite: 5].",
            "Publiquei um estudo clássico em 1972 com um colega[cite: 5].",
            "Meu sobrenome começa com M, e meu parceiro de pesquisa é Donald Shaw[cite: 5]."
        ]
    },
    {
        categoria: "Teorias do Jornalismo",
        resposta: "Teoria do Espelho",
        dicas: [
            "Estou relacionada a uma das principais discussões sobre a função social do jornalismo.",
            "Minha concepção está ligada a um ideal de representação dos acontecimentos.",
            "Sou associada à busca pela objetividade jornalística.",
            "Considero central a relação entre o acontecimento e o relato produzido pelo jornalista.",
            "Na minha perspectiva clássica, o profissional da imprensa deve evitar interferir no relato dos fatos.",
            "A resposta é a Teoria do Espelho (compreende o ideal de objetividade e o reflexo neutro da realidade)."
        ]
    },
    {
        categoria: "Teorias do Jornalismo",
        resposta: "Teoria do Espelho",
        dicas: [
            "Estou relacionada ao ideal de imparcialidade na produção das notícias.",
            "Uma metáfora óptica ajuda a explicar meu nome.",
            "Sou frequentemente discutida quando se questiona se o jornalista consegue relatar a realidade sem interpretá-la.",
            "Meu nome sugere que a notícia reproduz aquilo que acontece no mundo.",
            "Sou a teoria que compara o jornalismo a um reflexo da realidade.",
            "Compreende o ideal de objetividade e as críticas à ideia de que a notícia seja um reflexo neutro da realidade."
        ]
    },
    {
        categoria: "Teorias do Jornalismo",
        resposta: "Teoria do Gatekeeper",
        dicas: [
            "Estou ligada às escolhas feitas durante a produção de uma notícia.",
            "Ajudo a explicar por que nem todos os acontecimentos recebem cobertura jornalística.",
            "Investigo os filtros que uma informação precisa atravessar para chegar ao público.",
            "Posso envolver decisões individuais e profissionais dentro de uma redação.",
            "Um editor pode desempenhar um papel importante no processo que estudo.",
            "Relaciona-se à seleção e filtragem que definem o que se torna notícia."
        ]
    },
    {
        categoria: "Teorias do Jornalismo",
        resposta: "Teoria do Gatekeeper",
        dicas: [
            "Uma informação pode ser selecionada, modificada ou descartada durante esse processo.",
            "Sou associada ao estudo clássico de David Manning White, publicado em 1950.",
            "Minha palavra-chave é a seleção das notícias.",
            "Meu nome vem de uma expressão inglesa relacionada a quem controla uma passagem.",
            "Sou a teoria conhecida como a teoria do 'porteiro' ou 'guardião do portão' da informação.",
            "Objetivo: identificar os processos de seleção e filtragem que influenciam quais informações se tornam notícia."
        ]
    },
    {
        categoria: "Teorias do Jornalismo",
        resposta: "Teoria Organizacional",
        dicas: [
            "Considero que o trabalho jornalístico acontece dentro de estruturas profissionais e institucionais.",
            "As condições de trabalho podem interferir naquilo que será publicado.",
            "Os prazos de fechamento são importantes para entender o fenômeno que estudo.",
            "A divisão de tarefas entre repórteres, editores e outros profissionais faz parte da minha análise.",
            "Os recursos disponíveis em uma redação podem afetar a produção da notícia.",
            "Reconhece a influência das rotinas, da organização da redação, dos prazos e dos critérios de noticiabilidade."
        ]
    },
    {
        categoria: "Teorias do Jornalismo",
        resposta: "Teoria Organizacional",
        dicas: [
            "As rotinas profissionais e os critérios de noticiabilidade são fundamentais para me compreender.",
            "Não explico a produção jornalística apenas pelas escolhas individuais de um jornalista.",
            "Meu campo de estudo investiga como as notícias são produzidas, desde a seleção até a elaboração e publicação.",
            "Sou associada à análise das rotinas produtivas e organizacionais da construção da notícia.",
            "Ajudo a compreender por que notícias semelhantes podem ser produzidas de maneiras diferentes em contextos distintos.",
            "Analisa como rotinas, prazos e organização influenciam a noticiabilidade."
        ]
    },
    {
        categoria: "Teorias do Jornalismo",
        resposta: "Teorias de Ação Política",
        dicas: [
            "Estou relacionada à análise crítica do papel social dos meios de comunicação.",
            "Investigo relações entre jornalismo, sociedade e poder.",
            "Interesses econômicos podem ser relevantes para as abordagens que me compõem.",
            "As relações políticas podem influenciar a produção e a interpretação das notícias.",
            "Posso ajudar a investigar por que determinados grupos recebem mais destaque do que outros.",
            "Analisa como interesses, ideologias e relações de poder influenciam o jornalismo."
        ]
    },
    {
        categoria: "Teorias do Jornalismo",
        resposta: "Teorias de Ação Política",
        dicas: [
            "O enquadramento de um acontecimento pode ser analisado a partir das relações de poder.",
            "Questiono a ideia de que os meios de comunicação estejam sempre livres de interesses e conflitos.",
            "Algumas das minhas abordagens analisam a influência das ideologias sobre o conteúdo jornalístico.",
            "Sou associada a perspectivas que interpretam a mídia como participante de disputas políticas e ideológicas.",
            "Meu nome identifica um conjunto de abordagens que analisam como interesses econômicos e políticos podem influenciar o jornalismo.",
            "Investiga a influência de ideologias e disputas de poder no ecossistema de notícias."
        ]
    },
    {
        categoria: "Teorias do Jornalismo",
        resposta: "Hipótese da Agenda-setting",
        dicas: [
            "Estou relacionada à influência da comunicação na vida pública.",
            "Ajudo a compreender a relação entre os temas divulgados pela imprensa e as preocupações da sociedade.",
            "A frequência com que um assunto aparece pode ser relevante para minha análise.",
            "O destaque dado a um tema nas notícias é importante para mim.",
            "Não afirmo necessariamente que a mídia determine o que cada pessoa deve pensar sobre um assunto.",
            "Compreende a relação entre a saliência dos temas na mídia e a importância atribuída pelo público."
        ]
    },
    {
        categoria: "Teorias do Jornalismo",
        resposta: "Hipótese da Agenda-setting",
        dicas: [
            "Investigo como os meios de comunicação podem influenciar a importância que o público atribui a determinados temas.",
            "Um estudo clássico meu foi publicado em 1972, a partir de uma pesquisa sobre a campanha presidencial norte-americana de 1968.",
            "Sou frequentemente associada aos pesquisadores Maxwell McCombs e Donald Shaw.",
            "Sou a hipótese segundo a qual a mídia pode influenciar sobre quais assuntos as pessoas pensam e conversam.",
            "Meu nome em inglês remete a uma definição semelhante ao português.",
            "Analisa a capacidade de definir a pauta do debate público."
        ]
    }
];
