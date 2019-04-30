const readline = require('readline-sync');
const robos = {
  text: require('./robos/index.js')
};

/** Agrupar tudo */
async function start() {
  const content = {
    maximumSentences: 10
  };
  //Termo de busca
  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();
  // content.lang = askAndReturnLang(); -> Não está funcionando (Não envia a escolha da linguagem para o Algorithmia)

  await robos.text(content);

  function askAndReturnSearchTerm() {
    const termoPesquisa = readline.question(
      'Escreva o assunto a ser pesquisado na Wikipedia: '
    );
    return termoPesquisa;
  }

  function askAndReturnPrefix() {
    const prefixes = ['Quem e', 'O que e', 'A historia de'];
    const selectedPrefixIndex = readline.keyInSelect(
      prefixes,
      'Escolha uma opcao'
    );
    const selectedPrefixText = prefixes[selectedPrefixIndex];
    return selectedPrefixText;
  }

  function askAndReturnLang() {
    const lang = ['en', 'pt', 'es'];
    const selectedLangIndex = readline.keyInSelect(
      lang,
      'Escolha o idioma da pesquisa: '
    );
    const selectedLangText = lang[selectedLangIndex];
    return selectedLangText;
  }
  console.log(JSON.stringify(content, null, 4));
}

start();
