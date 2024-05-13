const RUBY_VERSION = "3.3";
const RUREMA_BASE_URL = "https://rurema.clear-code.com/api:v1";

export type Entry = {
  signature: string;
  score: number;
  metadata: MetaData;
  summary: string | null;
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
  description: string | null;
  snippets: string[];
};

type RelatedEntry = {
  key: string;
  label: string;
  type: string;
  url: string;
};

type SearchResult = ReturnType<typeof createSearchResult>;

function generateSearchUrl(
  keywords: Array<string | number>,
  version = RUBY_VERSION,
  baseUrl = RUREMA_BASE_URL,
) {
  if (isListElementsEmpty(keywords)) {
    throw new Error("keywords is empty");
  }
  const query = generateQueryByKeyword(keywords);
  const url = new URL(`${baseUrl}/version:${version}/${query}`);
  return url;
}

function isListElementsEmpty(arg: Array<string | number>) {
  return arg.every((v) => !v);
}

function createSearchResult(entry: Entry) {
  const url = replaceUrl(entry.documents[0].url);
  const subtitle = entry.summary?.replace(/\n/g, "") ?? "No summary";
  return {
    title: entry.signature,
    subtitle,
    arg: url,
    url,
    autocomplete: entry.signature,
    action: {
      url,
    },
    text: {
      copy: url,
      largetype: subtitle,
    },
    quicklookurl: url,
  };
}

function replaceUrl(url: string) {
  return url.replace("docs.ruby-lang.org/ja/search/http://", "");
}

function generateQueryByKeyword(keywords: Array<string | number>) {
  return keywords.reduce((result: string, word) => {
    return (result += `query:${word}/`);
  }, "");
}

async function fetchSearchResult(url: URL) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Error: response ${response.status}:${response.statusText}`,
    );
  }

  return response;
}

function createSearchResults(
  entries: Entry[],
  limit: number = 10,
): SearchResult[] {
  return entries.slice(0, limit).map((entry) => createSearchResult(entry));
}

async function getEntriesFromResponse(
  response: Response,
): Promise<Entry[]> {
  const json = await response.json();
  if (!("entries" in json)) {
    throw new Error("Invalid json format. entries is not found.");
  }
  return json.entries;
}

// TODO
// zodを導入してjsonのバリデーションを行いたい

export {
  createSearchResults,
  fetchSearchResult,
  generateSearchUrl,
  getEntriesFromResponse,
};
