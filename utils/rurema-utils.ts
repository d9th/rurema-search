//
// rurema-utils.js
//
const RUBY_VERSION = "3.3";
const RUREMA_BASE_URL = "https://rurema.clear-code.com/api:v1";

export type Entry = {
  signature: string;
  score: number;
  metadata: MetaData;
  summary: string | null | undefined;
  documents: Document[];
  related_entries: RelatedEntry[];
};

type MetaData = {
  type: string;
  versions: string[];
};

type Document = {
  version: string;
  url: string;
  description: string;
  snippets: string[];
};

type RelatedEntry = {
  key: string;
  label: string;
  type: string;
  url: string;
};

export function generateSearchUrl(
  keywords: string[],
  version = RUBY_VERSION,
  baseUrl = RUREMA_BASE_URL,
) {
  const query = generateQueryByKeyword(keywords);
  const url = new URL(`${baseUrl}/version:${version}/${query}`);
  return url;
}

export function createSearchResult(entry: Entry) {
  const url = replaceUrl(entry.documents[0].url);
  return {
    title: entry.signature,
    subtitle: entry.summary ?? "No summary",
    arg: url,
    url,
  };
}

function replaceUrl(url: string) {
  return url.replace("docs.ruby-lang.org/ja/search/http://", "");
}

function generateQueryByKeyword(keywords: string[]) {
  return keywords.reduce((result, word) => {
    return (result += `query:${word}/`);
  }, "");
}
