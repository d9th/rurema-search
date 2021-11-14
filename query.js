const url = new URL("https://httpbin.org");
console.log(url);

url.pathname = "json";
url.searchParams.set("query", "buzzing quux");
console.log(url);
