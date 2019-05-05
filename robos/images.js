const googleApis = require('googleapis').google;
const customSearch = googleApis.customsearch('v1');
const state = require('./state.js');

const googleSearchCredentials = require('../credentials/google-search');
async function robo() {
  const content = state.load();

  await fetchImagesOfAllSentences(content);

  state.save(content);

  async function fetchImagesOfAllSentences(content) {
    for (const sentence of content.sentences) {
      const query = `${content.termoPesquisa} ${sentence.keywords[0]}`;
      sentence.images = await fetchGoogleAndReturnImageLinks(query);

      sentence.googleSearchQuery = query;
    }
  }

  async function fetchGoogleAndReturnImageLinks(query) {
    const response = await customSearch.cse.list({
      auth: googleSearchCredentials.apiKey,
      cx: googleSearchCredentials.searchEngineId,
      q: query,
      searchType: 'image',
      imageSize: 'huge',
      num: 4
    });
    const imageUrl = response.data.items.map(item => {
      return item.link;
    });

    return imageUrl;
  }
}

module.exports = robo;
