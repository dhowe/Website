const fs = require('fs')
const https = require('https');
const projects = require('./projects.json');

const WebsitePath = "https://rednoise.org/daniel/";
const EventsUrl = "https://rednoise.org/wpr/wp-json/wp/v2/posts?categories=2&per_page=100";
const TimeStamp = getTimeStamp();

// Tools
const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const getAll = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .map(dirent => dirent.name)

function detailUrl(title) {
  return title.toLowerCase().replace(/[ .-\W]+/g, '');
}

function getTimeStamp() {
  const d = new Date();
  return d.toISOString();
}

function generateDetails() {
  const P = "0.70";
  const prjs = projects;
  let result = ""
  for (let i = 0; i < prjs.length; i++) {
    // add images
    result += "<url>\n  <loc>" + WebsitePath + detailUrl(prjs[i].shorttitle) 
      + "</loc>\n  <lastmod>" + TimeStamp + "</lastmod>\n  <priority>" + P + "</priority>\n";
    result += !prjs[i].images ? "" : "  <image:image>\n    <image:loc>" + WebsitePath 
      + prjs[i].images[0].src + "</image:loc>\n  </image:image>\n";
    result += "</url>\n";
  }
  return result;
}

function generateProjectPages() {
  // Not in use
  let result = ""
  const allPages = getDirectories("./pages");
  for (let i = 0; i < allPages.length; i++) {
    result += "<url>\n  <loc>" + WebsitePath + "pages/" + allPages[i] 
      + "</loc>\n  <priority>0.80</priority>\n</url>\n";
  }
  return result;
}

function generateRoot() {
  const P = "0.80";
  // init with home page
  let result = "\n<url>\n  <loc>" + WebsitePath + "</loc>\n  <lastmod>"
    + TimeStamp + "</lastmod>\n  <priority>1.00</priority>\n</url>\n";
  const all = getAll("./");
  for (let i = 0; i < all.length; i++) {
    if (all[i] != "index.html" && all[i].indexOf(".html") > 0) {
      result += "<url>\n  <loc>" + WebsitePath + all[i] + "</loc>\n  <lastmod>"
        + TimeStamp + "</lastmod>\n  <priority>" + P + "</priority>\n</url>\n";
    }
  }
  return result;
}

async function generateSiteMap() {
  let newSiteMap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';

  newSiteMap += generateRoot();
  newSiteMap += generateDetails();
  newSiteMap += await generateWpr()
  newSiteMap += "</urlset>";

  fs.writeFile("sitemap.xml", newSiteMap, function () {
    console.log("sitemap.xml updated")
  });
}

async function generateWpr() {
  let p = "0.51", result = '';
  const raw = await doRequest(EventsUrl);
  const json = JSON.parse(raw);
  json.forEach((post) => {
    result += "<url>\n  <loc>" + post.link + "</loc>\n  <lastmod>"
      + TimeStamp + "</lastmod>\n  <priority>" + p + "</priority>\n</url>\n";
  });
  return result;
}

async function doRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        resolve(data);
      });
    }).on("error", (error) => {
      reject(error);
    });
  });
}

generateSiteMap();