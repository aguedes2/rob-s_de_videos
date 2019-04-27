const readline = require('readline-sync');

/** Agrupar tudo */
function start() {
  const content = {};
  //Termo de busca
  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

  function askAndReturnSearchTerm() {
    return readline.question(
      'Escreva o assunto a ser pesquisado na Wikipedia: '
    );
  }

  function askAndReturnPrefix() {
    const prefixes = ['Quem', 'O que', 'A historia de'];
    const selectedPrefixIndex = readline.keyInSelect(
      prefixes,
      'Escolha uma opcao'
    );
    const selectedPrefixtext = prefixes[selectedPrefixIndex];
    return selectedPrefixIndex;

    console.log(selectedPrefixIndex);
  }

  console.log(content);
}

start();
