const readline = require('readline-sync');
const state = require('./state.js');

function robo() {
  const content = { maximumSentences: 10 };
  content.termoPesquisa = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();
  //content.lang = askAndReturnLang();
  state.save(content);

  //Termo de busca
  function askAndReturnSearchTerm() {
    const termoPesquisa = readline.question(
      'Escreva o assunto a ser pesquisado na Wikipedia: '
    );
    return termoPesquisa;
  }

  //Refinamento da busca (âmbito)
  function askAndReturnPrefix() {
    const prefixes = ['Quem e', 'O que e', 'A historia de'];
    const selectedPrefixIndex = readline.keyInSelect(
      prefixes,
      'Escolha uma opcao'
    );
    const selectedPrefixText = prefixes[selectedPrefixIndex];
    return selectedPrefixText;
  }

  //Definição do idioma do conteúdo buscado
  function askAndReturnLang() {
    const lang = ['en', 'pt', 'es'];
    const selectedLangIndex = readline.keyInSelect(
      lang,
      'Escolha o idioma da pesquisa: '
    );
    const selectedLangText = lang[selectedLangIndex];
    return selectedLangText;
  }
}
module.exports = robo;
