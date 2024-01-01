import { assertEquals } from "https://deno.land/std@0.138.0/testing/asserts.ts";
import { generateSearchUrl } from "../utils/rurema-utils.ts";

Deno.test("generateSearchUrl returns URL with specified version", () => {
  const keywords = ["Array", "length"];
  const version = "3.2.0";
  const expectedUrl =
    "https://rurema.clear-code.com/api:v1/version:3.2.0/query:Array/query:length/";
  assertEquals(generateSearchUrl(keywords, version).toString(), expectedUrl);
});

Deno.test(
  "generateSearchUrl returns URL with default version if not specified",
  () => {
    const keywords = ["Array", "length"];
    const expectedUrl =
      "https://rurema.clear-code.com/api:v1/version:3.2.0/query:Array/query:length/";

    assertEquals(generateSearchUrl(keywords).toString(), expectedUrl);
  },
);
