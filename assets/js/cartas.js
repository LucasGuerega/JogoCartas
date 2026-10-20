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
        resposta: "Santos Dumont",
        dicas: [
            "Nasci em 1873, numa fazenda em Minas Gerais.",
            "Meu pai era engenheiro e ficou rico com o café.",
            "Passei boa parte da vida em Paris.",
            "Pedi a um joalheiro um relógio de pulso para usar durante os voos.",
            "Fiz voos públicos a bordo do 14-Bis.",
            "Sou conhecido como o Pai da Aviação."
        ]
    },
    {
        categoria: "Lugar",
        resposta: "Cristo Redentor",
        dicas: [
            "Fica no alto de uma montanha de cerca de 710 metros.",
            "Fui inaugurado em 1931.",
            "Fui eleito uma das Sete Maravilhas do Mundo Moderno em 2007.",
            "Tenho cerca de 30 metros de altura, sem contar o pedestal.",
            "Fico no Rio de Janeiro, dentro do Parque Nacional da Tijuca.",
            "Sou uma estátua de braços abertos sobre o Corcovado."
        ]
    },
    {
        categoria: "Animal",
        resposta: "Ornitorrinco",
        dicas: [
            "Vivo na Austrália e na Tasmânia.",
            "Os machos têm um esporão venenoso nas patas traseiras.",
            "Sou um dos poucos mamíferos que botam ovos.",
            "Sou semiaquático e passo muito tempo em rios e riachos.",
            "Tenho uma cauda parecida com a de um castor.",
            "Tenho um bico que lembra o de um pato."
        ]
    },
    {
        categoria: "Pessoa",
        resposta: "Marie Curie",
        dicas: [
            "Nasci em Varsóvia, em 1867.",
            "Em 1906, fui a primeira mulher a dar aulas na Universidade de Paris.",
            "Meu marido, Pierre, morreu atropelado por uma carruagem.",
            "Descobri os elementos polônio e rádio.",
            "Ganhei dois Prêmios Nobel, um de Física e outro de Química.",
            "Fui pioneira nos estudos da radioatividade, palavra que eu mesma criei."
        ]
    },
    {
        categoria: "Lugar",
        resposta: "Machu Picchu",
        dicas: [
            "Fui construída por volta do século XV.",
            "Fui divulgada ao mundo ocidental em 1911 por Hiram Bingham.",
            "Estou a cerca de 2.400 metros de altitude.",
            "Sou Patrimônio Mundial da UNESCO desde 1983.",
            "Fico nos Andes, no Peru.",
            "Sou uma cidadela construída pelos incas."
        ]
    },
    {
        categoria: "Animal",
        resposta: "Camaleão",
        dicas: [
            "Quase metade das minhas espécies vive em Madagascar.",
            "Meus olhos giram de forma independente um do outro.",
            "Minha língua pode ser mais longa que o meu corpo.",
            "Mudo de cor para me comunicar e regular minha temperatura.",
            "Sou um réptil que vive subindo em árvores.",
            "Sou famoso por mudar de cor."
        ]
    },
    {
        categoria: "Objeto",
        resposta: "Bússola",
        dicas: [
            "Minha invenção é atribuída aos chineses, há mais de 2 mil anos.",
            "Os navegadores passaram a me usar para se orientar em alto-mar.",
            "Dentro de mim existe uma peça magnetizada que gira livremente.",
            "Sou muito usada por escoteiros e exploradores.",
            "Minha agulha aponta para o norte magnético.",
            "Sou um instrumento de orientação com uma agulha."
        ]
    },
    {
        categoria: "Objeto",
        resposta: "Microscópio",
        dicas: [
            "Zacharias Janssen é frequentemente citado como um dos meus inventores.",
            "No século XVII, Leeuwenhoek usou versões minhas para observar micróbios.",
            "Funciono com um conjunto de lentes.",
            "Fico em laboratórios e salas de aula.",
            "Faço enxergar coisas minúsculas.",
            "Sou o instrumento ideal para observar células."
        ]
    }
];