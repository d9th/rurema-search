import { assertEquals, assertInstanceOf } from "@std/assert";
import {
  createSearchResult,
  generateSearchUrl,
} from "../utils/rurema-utils.ts";

Deno.test("generateSearchUrlはURLオブジェクトを返す", () => {
  const keywords = ["String", "length"];
  assertInstanceOf(generateSearchUrl(keywords), URL);
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
Deno.test("createSearchResultは適切な結果を返す .", () => {
  const entry = {
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
  };
  const result = createSearchResult(entry);
  const expected = {
    title: "Array#each -> Enumerator",
    subtitle: "各要素に対してブロックを評価します。",
    arg: "https://rurema.clear-code.com/3.2.0/method/Array/i/each.html",
    url: "https://rurema.clear-code.com/3.2.0/method/Array/i/each.html",
  };
  assertEquals(result, expected);
});

Deno.test("createSearchResultはsummaryがnull,undefinedの場合はNo Entryを返す", () => {
  const entry = {
    signature: "Array#each -> Enumerator",
    score: 81415.0,
    metadata: { type: "instance-method", versions: ["3.2.0"] },
    summary: null,
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
  };
  const result = createSearchResult(entry);
  const expected = {
    title: "Array#each -> Enumerator",
    subtitle: "No summary",
    arg: "https://rurema.clear-code.com/3.2.0/method/Array/i/each.html",
    url: "https://rurema.clear-code.com/3.2.0/method/Array/i/each.html",
  };
  assertEquals(result, expected);
});
