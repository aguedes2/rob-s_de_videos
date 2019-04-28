const readline = require('readline-sync');
const robos = {
  text: require('./robos/index.js')
};

/** Agrupar tudo */
async function start() {
  const content = {};
  //Termo de busca
  content.searchTerm = askAndReturnSearchTerm();
  content.prefix = askAndReturnPrefix();

  await robos.text(content);

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
    const selectedPrefixText = prefixes[selectedPrefixIndex];
    return selectedPrefixText;

    console.log(selectedPrefixText);
  }

  console.log('-------------------\n\nCONTEÚDO LIMPO\n\n--------------------');
  // console.log(content.sourceContentSanitized);
}

start();
