//
// rurema-utils.js
//
const RUBY_VERSION = "3.2.0";

function generateQueryByKeyword(keywords) {
  return keywords.reduce((result, word) => {
    return (result += `query:${word}/`);
  }, "");
}

export function generateSearchUrl(keywords, version = RUBY_VERSION) {
  const query = generateQueryByKeyword(keywords);
  const baseUrl = "https://rurema.clear-code.com/api:v1";
  const url = new URL(`${baseUrl}/version:${version}/${query}`);
  return url;
}

function replaceUrl(url) {
  return url.replace("docs.ruby-lang.org/ja/search/http://", "");
  // .replace(RUBY_VERSION, "3.2");
}

export function createSearchResult(entry) {
  const url = replaceUrl(entry.documents[0].url);
  return {
    title: entry.signature,
    subtitle: entry.summary ?? "No summary",
    arg: url,
    url,
  };
}
