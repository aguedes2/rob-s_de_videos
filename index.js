const robos = {
  input: require('./robos/input.js'),
  text: require('./robos/text.js'),
  state: require('./robos/state.js'),
  image: require('./robos/images.js')
};

/** Agrupar tudo */
async function start() {
  robos.input();
  await robos.text();
  await robos.image();

  const content = robos.state.load();
  console.dir(content, { depth: null });
}

start();
