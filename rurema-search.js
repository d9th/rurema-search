// rurema search pluing for Alfred
// rurema API
// https://docs.ruby-lang.org/ja/search/api:v1/version:3.0.0/query:string/query:length/

// ruremaはquery=foo+barでリクエストすると
// /query:foo/query:bar/へ変換してるくれてるようだ
// ?query=foo+barでリクエストしても大丈夫

const RUBY_VERSION = "3.0.0";

const searchKeyword = Deno.args.join(" ");

const url = new URL(
  `https://docs.ruby-lang.org/ja/search/api:v1/version:${RUBY_VERSION}/`
);

url.searchParams.set("query", searchKeyword);

const response = await fetch(url, {
  redirect: "follow",
  headers: {
    "Content-Type": "application/json",
  },
});

if (response.ok) {
  const { entries } = await response.json();
  const resultOfSearch = entries.slice(0, 9).map(entry => {
    const url = entry.documents[0].url.replace(
      "docs.ruby-lang.org/ja/search/http://",
      ""
    );
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
