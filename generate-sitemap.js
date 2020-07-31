fs = require('fs')
const { readdirSync } = require('fs')

const WebsitePath = "https://rednoise.org/daniel/";
const TimeStamp = getTimeStamp();

// Tools
const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const getAll = source =>
  readdirSync(source, { withFileTypes: true })
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
  const prjs = require('./projects.json')
  let result = ""
  for (let i = 0; i < prjs.length; i++) {
    // add images
    result += "<url><loc>" + WebsitePath +  detailUrl(prjs[i].shorttitle) + "</loc><lastmod>" + TimeStamp + "</lastmod><priority>" + P + "</priority>\n";
    result += !prjs[i].images ? "" : "  <image:image><image:loc>" + WebsitePath + prjs[i].images[0].src + "</image:loc></image:image>\n";
    result += "</url>\n";
  }
  return result;
}

function generateProjectPages() {
  // Not in use
  let result = ""
  const allPages = getDirectories("./pages");
  for (let i = 0; i < allPages.length; i++) {
    result += "<url><loc>"+ WebsitePath + "pages/" + allPages[i] + "</loc><priority>0.80</priority></url>\n";
  }
  return result;
}

function generateRoot() {
  const P = "0.80";
  // init with home page
  let result = "<url><loc>" + WebsitePath + "</loc><lastmod>" + TimeStamp + "</lastmod><priority>1.00</priority></url>\n";
  const all = getAll("./");
  for (let i = 0; i < all.length; i++) {
    if (all[i] != "index.html" && all[i].indexOf(".html") > 0) {
      result += "<url><loc>"+ WebsitePath + all[i] + "</loc><lastmod>" + TimeStamp + "</lastmod><priority>" + P + "</priority></url>\n";
    }
}
  return result;
}

async function generateWpr() {
  const P = "0.51";
  const EVENTS = "https://rednoise.org/wpr/wp-json/wp/v2/posts?categories=2&per_page=100";

  async function getResult() {
    const request = require("request-promise");
    let result = "";
    await request({url: EVENTS, json: true}, function(err, res, json) {
        if (err) {
          throw err;
        }
        json.forEach((post, i) => {
          result += "<url><loc>"+ WebsitePath + post.link + "</loc><lastmod>" + TimeStamp + "</lastmod><priority>" + P + "</priority></url>\n";
        });
      });
    return result;
  }

  const result = await getResult();
  return result;
}

async function generateNewSiteMap() {
  let newSiteMap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';

  newSiteMap += generateRoot();
  newSiteMap += generateDetails();
  newSiteMap += await generateWpr();
  newSiteMap += "</urlset>";

  fs.writeFile("sitemap.xml", newSiteMap, function(){
    console.log("sitemap.xml has been updated!")
  });
}

generateNewSiteMap();
