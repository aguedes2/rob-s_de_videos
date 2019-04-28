const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;
const sentencesBoudaryDetection = require('sbd');

async function robo(content) {
  await fetchContentFromWikipedia(content); //Baixar conteúdo do wikipedia
  sanitizeContent(content); //Limpar (sanitizar) conteúdo baixado
  breakContentIntoSentences(content); //Quebrar o conteúdo em sentenças

  async function fetchContentFromWikipedia(content) {
    //altenticação na API algorithmia
    //Instancia altenticada do algorithmina no wikipedia
    //resposta do wikipedia ao Algorithmia método pipe aceita como parâmetro o termo que queremos buscar no wikipedia
    // O pegar o conteúdo do wikipedia e salvar na variável
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
      'web/WikipediaParser/0.1.2'
    );
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
    const wikipediaContent = wikipediaResponse.get();

    content.sourceContentOriginal = wikipediaContent.content;
  }

  /**
   * Primeiro quebrar o texto em linhas e remover as linhas em branco
   * @param {*} content
   */
  function sanitizeContent(content) {
    const withoutBlankLinesAndMarkDown = removeBlankLinesAndMarkDown(
      content.sourceContentOriginal
    );
    const withotDatesInParentheses = removeDatesInParentesis(
      withoutBlankLinesAndMarkDown
    );

    content.sourceContentSanitized = withotDatesInParentheses;

    /**
     * Função para:
     * - quebra de linha no conteúdo retornado pela wikipedia
     * - remover as linhas em branco
     * - remover as macações da página da wikipedia e juntar tudo num único texto
     * @param {content.sourceContentOriginal} text
     */
    function removeBlankLinesAndMarkDown(text) {
      const allLines = text.split('\n');
      //remover linhas em branco
      const withoutBlankLinesAndMarkDown = allLines.filter(line => {
        if (line.trim().length === 0 || line.trim().startsWith('=')) {
          return false;
        }
        return true;
      });
      return withoutBlankLinesAndMarkDown.join(' ');
    }

    function removeDatesInParentesis(text) {
      return text
        .replace(/\((?:\([^()]*\)|[^()])*\)/gm, '')
        .replace(/  /g, ' ');
    }
  }

  function breakContentIntoSentences(content) {
    //Estrutura de dados
    content.sentences = [];

    const sentences = sentencesBoudaryDetection.sentences(
      content.sourceContentSanitized
    );

    //iterar o array de sentenças e fazer um push de cada sentença no array de sentenças da estrutura de dados
    //Aproveitando para já inicializar as keywords e as images
    sentences.forEach(sentences => {
      content.sentences.push({
        text: sentences,
        keywords: [],
        images: []
      });
    });

    console.log(content.sentences);
  }
}

module.exports = robo;
