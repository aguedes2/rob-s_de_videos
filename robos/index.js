const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey;
const sentencesBoudaryDetection = require('sbd');

const watsonApiKey = require('../credentials/watson-nlu.json').apikey;
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: watsonApiKey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

async function robo(content) {
  await fetchContentFromWikipedia(content); //Baixar conteúdo do wikipedia
  sanitizeContent(content); //Limpar (sanitizar) conteúdo baixado
  breakContentIntoSentences(content); //Quebrar o conteúdo em sentenças
  limitMaximumSentences(content); //limitar a quantidade de sentenças na resposta
  await fechKeywordsOfAllSentences(content);

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
  }

  //Limitar a quantidade de sentenças buscadas no wikipedia
  function limitMaximumSentences(content) {
    content.sentences = content.sentences.slice(0, content.maximumSentences);
  }

  async function fechKeywordsOfAllSentences(content) {
    for (const sentence of content.sentences) {
      sentence.keywords = await fetchWatsonAndReturnKeyWords(sentence.text);
    }
  }

  async function fetchWatsonAndReturnKeyWords(sentence) {
    return new Promise((resolve, reject) => {
      nlu.analyze(
        {
          text: sentence,
          features: {
            keywords: {}
          }
        },
        (error, response) => {
          if (error) {
            throw error;
          }
          const keywords = response.keywords.map(keyword => {
            return keyword.text;
          });
          resolve(keywords);
        }
      );
    });
  }
}

module.exports = robo;
