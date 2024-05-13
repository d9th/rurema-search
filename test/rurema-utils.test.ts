import {
  assertEquals,
  assertInstanceOf,
  assertRejects,
  assertThrows,
} from "@std/assert";
import {
  createSearchResults,
  fetchSearchResult,
  generateSearchUrl,
} from "../utils/rurema-utils.ts";

import { stub } from "@std/testing/mock";

Deno.test("generateSearchUrlはURLオブジェクトを返す", () => {
  const keywords = ["String", "length"];
  assertInstanceOf(generateSearchUrl(keywords), URL);
});

Deno.test("generateSearchUrlはキーワードが空の時エラーを返す", () => {
  const keywords: string[] = [];
  assertThrows(
    () => generateSearchUrl(keywords),
    Error,
    "keywords is empty",
  );
});

Deno.test("generateSearchUrlは指定したバージョンのURLを返す", () => {
  const keywords = ["Array", "length"];
  const version = "3.2.0";
  const expectedUrl =
    `https://rurema.clear-code.com/api:v1/version:${version}/query:Array/query:length/`;
  assertEquals(generateSearchUrl(keywords, version).toString(), expectedUrl);
});

Deno.test(
  "generateSearchUrlはバージョンの指定がない時3.3のURLを返す",
  () => {
    const keywords = ["Array", "length"];
    const expectedUrl =
      "https://rurema.clear-code.com/api:v1/version:3.3/query:Array/query:length/";

    assertEquals(generateSearchUrl(keywords).toString(), expectedUrl);
  },
);
// fetchSearchResultのテスト
Deno.test("fetchSearchResultはResponseオブジェクトを返す", async () => {
  const url = new URL("https://httpbin.org/get");
  const fetchStub = stub(
    globalThis,
    "fetch",
    () => Promise.resolve(new Response("mock fetch testing.")),
  );
  try {
    const response = await fetchSearchResult(url);
    assertInstanceOf(response, Response);
  } finally {
    fetchStub.restore();
  }
});

Deno.test("fetchSearchResultはネットワークエラーが発生した時例外を投げる", async () => {
  const url = new URL("https://httpbin.org/get");
  const fetchStub = stub(
    globalThis,
    "fetch",
    () => Promise.reject(new Error("fetch error")),
  );
  try {
    await assertRejects(
      () => fetchSearchResult(url),
      Error,
      "fetch error",
    );
  } finally {
    fetchStub.restore();
  }
});

Deno.test("fetchSearchResultは404の時は例外を投げる事", async () => {
  const url = new URL("https://example.com/api/404");
  const fetchStub = stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(
        new Response(null, { status: 404, statusText: "Not Found" }),
      ),
  );
  try {
    // `Failed to fetch. ${response.statusText}` が例外メッセージになる
    await assertRejects(
      () => fetchSearchResult(url),
      Error,
      "Error: response 404:Not Found",
    );
  } finally {
    fetchStub.restore();
  }
});

Deno.test("createSearchResultsは指定された数の検索結果を返す", () => {
  const entries = [
    {
      signature: "Array#each -> Enumerator",
      score: 81415.0,
      metadata: { type: "instance-method", versions: ["3.2.0"] },
      summary: "各要素に対してブロックを評価します。",
      documents: [
        {
          version: "3.2.0",
          url: "https://rurema.clear-code.com/3.2.0/method/Array/i/each.html",
          description:
            "各要素に対してブロックを評価します。\n\nブロックが与えられなかった場合は、自身と each から生成した\nEnumerator オブジェクトを返します。\n\n//emlist[例][ruby]{\n[1, 2, 3].each do |i|\n  puts i\nend\n#=> 1\n#   2\n#   3\n//}\n\n\n@see Array#each_index, Array#reverse_each",
          snippets: [],
        },
      ],
      related_entries: [
        {
          key: "Array",
          label: "Array",
          type: "class",
          url: "https://rurema.clear-code.com/api:v1/class:Array/",
        },
        {
          key: "Enumerator",
          label: "Enumerator",
          type: "query",
          url: "https://rurema.clear-code.com/api:v1/query:Enumerator/",
        },
      ],
    },
  ];

  const limit = 5;
  const expectedResults = [
    {
      title: "Array#each -> Enumerator",
      subtitle: "各要素に対してブロックを評価します。",
      arg: "https://rurema.clear-code.com/3.2.0/method/Array/i/each.html",
      url: "https://rurema.clear-code.com/3.2.0/method/Array/i/each.html",
      autocomplete: "Array#each -> Enumerator",
      action: {
        url: "https://rurema.clear-code.com/3.2.0/method/Array/i/each.html",
      },
      text: {
        copy: "https://rurema.clear-code.com/3.2.0/method/Array/i/each.html",
        largetype: "各要素に対してブロックを評価します。",
      },
      quicklookurl:
        "https://rurema.clear-code.com/3.2.0/method/Array/i/each.html",
    },
  ];

  const results = createSearchResults(entries, limit);

  assertEquals(results, expectedResults);
});
