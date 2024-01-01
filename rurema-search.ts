// rurema search plugin for Alfred
// rurema API
// https://docs.ruby-lang.org/ja/search/api:v1/version:3.1.0/query:string/query:length/

import { generateSearchUrl, createSearchResult } from "./utils/rurema-utils.js";

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
  console.log(JSON.stringify({ items: result }));
} catch (error) {
  console.error(error);
}
