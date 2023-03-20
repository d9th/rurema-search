// rurema search plugin for Alfred
// rurema API
// https://docs.ruby-lang.org/ja/search/api:v1/version:3.1.0/query:string/query:length/

// ruremaはquery=foo+barでリクエストすると
// /query:foo/query:bar/へ変換してるくれてるようだ
// ?query=foo+barでリクエストしても大丈夫

const RUBY_VERSION = "3.2.0";

function generateQueryByKeyword(keywords) {
  return keywords.reduce((prev, curr) => {
    return (prev += `query:${curr}/`);
  }, "");
}

function generateSearchUrl(keywords, version = RUBY_VERSION) {
  const query = generateQueryByKeyword(keywords);
  const baseUrl = "https://rurema.clear-code.com/api:v1";
  // `https://docs.ruby-lang.org/ja/search/api:v1/version:${version}/${query}`
  const url = new URL(`${baseUrl}/version:${version}/${query}`);
  return url;
}

function replaceUrl(url) {
  return url.replace("docs.ruby-lang.org/ja/search/http://", "");
  // .replace(RUBY_VERSION, "3.2");
}

function createSearchResult(entry) {
  const url = replaceUrl(entry.documents[0].url);
  return {
    title: entry.signature,
    subtitle: entry.summary ?? "No summary",
    arg: url,
    url,
  };
}

const searchKeywords = Deno.args;
const url = generateSearchUrl(searchKeywords);

try {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  const { entries } = await response.json();
  const result = entries.slice(0, 9).map(entry => createSearchResult(entry));
  console.log(JSON.stringify({ item: result }));
} catch (error) {
  console.error(error);
}
