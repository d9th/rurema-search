// rurema search plugin for Alfred

import {
  createSearchResults,
  fetchSearchResult,
  generateSearchUrl,
  getEntriesFromResponse,
} from "./utils/rurema-utils.ts";

import { parseArgs } from "@std/cli";

const args = parseArgs(Deno.args);
const searchKeywords = args._;
const MAX_RESULTS = args["count"] ?? 10;

try {
  const url = generateSearchUrl(searchKeywords);
  const response = await fetchSearchResult(url);
  const entries = await getEntriesFromResponse(response);

  const result = createSearchResults(entries, MAX_RESULTS);
  console.log(JSON.stringify({ items: result }));
} catch (error) {
  console.error(error.message);
  console.log(JSON.stringify({ items: [{ title: error.message }] }));
}
