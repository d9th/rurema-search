// rurema search pluing for Alfred
// rurema API
// https://docs.ruby-lang.org/ja/search/api:v1/version:3.0.0/query:string/query:length/

// ruremaはquery=foo+barでリクエストすると
// /query:foo/query:bar/へ変換してるくれてるようだ
// ?query=foo+barでリクエストしても大丈夫

const RUBY_VERSION = "3.1.0";

const argsOfKeyword = Deno.args;
const queryByKeyword = argsOfKeyword.reduce((prev, curr) => {
  return (prev += `query:${curr}/`);
}, "");

const url = new URL(
  `https://docs.ruby-lang.org/ja/search/api:v1/version:${RUBY_VERSION}/${queryByKeyword}`
);

// url.searchParams.set("query", searchKeyword);

const response = await fetch(url, {
  redirect: "follow",
  headers: {
    "Content-Type": "application/json",
  },
});

if (response.ok) {
  const { entries } = await response.json();
  const resultOfSearch = entries.slice(0, 9).map(entry => {
    let url = entry.documents[0].url.replace(
      "docs.ruby-lang.org/ja/search/http://",
      ""
    );
    // 3.1.0では404を返すので3.1に置換処理をする
    url = url.replace("3.1.0", "3.1");

    return {
      title: entry.signature,
      subtitle: entry.summary ?? "No summary",
      arg: url,
      url,
    };
  });

  const alfredJson = {
    items: resultOfSearch,
  };
  console.log(JSON.stringify(alfredJson));
}
