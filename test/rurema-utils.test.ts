import {
  assertEquals,
  assertInstanceOf,
} from "https://deno.land/std@0.210.0/assert/mod.ts";

import { generateSearchUrl } from "../utils/rurema-utils.ts";

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
  "generateSearchUrlはバージョンの指定がない時3.2.0のURLを返す",
  () => {
    const keywords = ["Array", "length"];
    const expectedUrl =
      "https://rurema.clear-code.com/api:v1/version:3.2.0/query:Array/query:length/";

    assertEquals(generateSearchUrl(keywords).toString(), expectedUrl);
  },
);
