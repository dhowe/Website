var lastCols = 0;
var featured = [
  "Spectre", "Big Dada", "AdNauseam", "How It Is",
  "Advertising Positions",
  "The Readers Project"   // min image size 1100px @2x
  // "Radical of the Vertical Heart 忄", "Automatype",
];

function createGrid(projects) {
  
  var gridSmall = "s";
  var gridLarge = "l";
  var gridLargeRight = "lr";
  var noOfSpecialLayout = 6;

  // create grid in html
  for (var html, i = 0; i < projects.length; i++) {
    var g;
    if (i % 6 === 0 && i < noOfSpecialLayout) {
      g = gridLarge;
    } else if (i % 6 === 3 && i < noOfSpecialLayout) {
      g = gridLargeRight;
    }
    else {
      g = gridSmall;
    }

    var fontCheck = projects[i].shorttitle.length > 28 ? " class='smallerTitle'" : "";
    var useHighResImage = g.indexOf("l") > -1;

    html = "<a href='" + projLink(projects[i]) + "'>"; // need encodeURIComponent?
    html += "<div class='project gridSize-" + g + "'>"; 
    html += "<img data-rjs='2' class='" + (useHighResImage ? "highres" : "project")
      + "' src=" + (useHighResImage ? betterImage(projects[i].thumb) : projects[i].thumb) + ">";
    html += "<div class='project-description'>";
    html += "<h5" + fontCheck + ">" + projects[i].shorttitle + "</h5>";
    html += "<p>" + projects[i].shortdesc + "</p>";
    html += "</div></a>";
    html += "</div>";
    $('#projects .grid').append(html);
  }

  $('#projects .grid').append("<div class='space'></div>");

  adjustItemContent();
}

function createEventCol(url) {
  let maxEntriesShown = 20, bottomMark = 0;
  $('#projects .events').remove();
  $('#projects').append("<div class='events'><h4>NEWS / EVENTS</h4><div class='wrapper'></div></div>");
  $.getJSON(url, (data) => {
    data.forEach((post, i) => {
      if (maxEntriesShown) {
        //console.log(post.date, post.title, post.link);
        html = "<a href='" + post.link + "'><p>"
        const rawData = post.title.rendered.split(":");
        const [type, title] = rawData;
        // html += "<span class='date'>" + post.date +"</span>";
        html += "<span class='type'>" + type + "</span>";
        html += "<span class='title'>" + title + "</span>";
        // html += "<span class='details'>Extra Info</span>";
        html += "</p></a>";
        $('#projects .events .wrapper').append(html);
        bottomMark = $('.wrapper')[0].offsetTop + $('.wrapper').height();
        if (bottomMark > $(window).height() - 200) {
          $('#projects .events .wrapper a:last-child').addClass("hide");
        }
        maxEntriesShown--;
      }
    });
    // append more button
    let mb = "<a href='https://rednoise.org/wpr/'><div class='button more'>More</div></a>"
    $('#projects .events').append(mb);

  });
}

function updateEventsLayout() {
  let bottomMark = 0;
  $('#projects .events .wrapper a').removeClass("hide");
  $(".events .wrapper a").addClass(function () {
    const toHide = $(this)[0].offsetTop + $(this).find("p").outerHeight() > $(window).height() - 150;
    return toHide ? "hide" : "";
  })
}

function betterImage(src) {
  var srcReplace = /(\.[A-z]{3,4}\/?(\?.*)?)$/;
  var newSrc = src.replace(srcReplace, '@2x$1');
  return newSrc;
}

function afterGridCreated(projects) {

  $('.project img').css("height", $('.project img').width() * 0.65);
  adjustItemHeight(projects);
  adjustFooterSpace();
  selectNavigation();
}

function selectNavigation() {

  var $navlist = $('#navlist');
  if (location.href.indexOf('/mit/') > -1)
    $navlist.html('<li><a class="current" href="index.html">ACM/MIT: Selected Projects</a></li>');
  else if (location.href.indexOf('/saic/') > -1)
    $navlist.html('<li><a class="current" href="index.html">SAIC: Portfolio</a></li>');
  else if (location.href.indexOf('/sjsu/') > -1)
    $navlist.html('<li><a class="current" href="index.html">SJSU: Portfolio</a></li>');
  else if (location.href.indexOf('/tandon/') > -1)
    $navlist.html('<li><a class="current" href="index.html">NYU/Tandon: Portfolio</a></li>');
}

function projLink(proj) {
  if (proj.directLink) return proj.directLink;
  return proj.longdesc ? 'detail.html#' + detailUrl(proj.shorttitle) : "";
}

function detailUrl(title) {

  return title.toLowerCase().replace(/[ .-\W]+/g, '');
}

function createDetail(projects, id) {

  selectNavigation();

  // hide the previous
  $('.projectlong').hide();

  var current, idk = 0;
  for (var i = 0; i < projects.length; i++) {
    var title = projects[i].shorttitle.toLowerCase().replace(/[ .-\W]+/g, '');
    if (title === id) {
      current = projects[i]
      idk = i;
      break;
    };
  }

  // wrong id or no id
  if (current === undefined) window.location.href = 'index.html';

  // update meta tags for current project
  $('meta[name=title], meta[name=description]').remove();
  $('head').append('<meta name="description" content="' + current.longtitle
    + ', by Daniel Howe"><meta name="title" content="' + current.longtitle + '">');

  // if the div is already created, show the div
  if ($('.projectlong#' + id).length > 0) {
    $('.projectlong#' + id).show();
    return;
  }

  // if not, create the div
  var html = "";
  html += "<div class='projectlong' id='" +
    detailUrl(current.shorttitle) + "'><div class='grid'>";
  html += "<div class='content clearfix'><div class='col-8-12 mobile-col-1-1 gap'>";
  html += "<h4>" + current.longtitle + "</h4>";
  if (projects[i].collaborators) {
    html += "<p class='collaborators'> w' " + projects[i].collaborators + "</p>";
  }

  // LONG TEXT
  if (current.longdesc != undefined) {
    html += "<p class='longdesc'>" + current.longdesc + "</p>";
  }

  // QUOTES
  if (current.quotes) {
    html += "<div class='quotes'>";
    for (var j = 0; j < current.quotes.length; j++) {
      //<li><a href="">XXX</a></li>
      html += "<p>&quot<i>" + current.quotes[j].text + "</i>&quot";
      html += "<span>- " + current.quotes[j].from + "</span></p>";
    }
    html += "</div>";
  }

  // IFRAME SKETCH
  if (current.sketch) {
    html += "<iframe id='" + current.shorttitle
      + "_sketch' name='sketch' src='" + current.sketch + "'></iframe>";
    // mute sketch whenever a link redirect is triggered on current detailed page
    html += "<script type='text/javascript'>if (getCurrentIdFromUrl($(location).attr('href')) == '"
       + current.shorttitle.toLowerCase() + "') $('a').click(function(){muteSketch()});</script>";
  }

  // RELATED PROJECTS
  if (current.projects) {

    html += "<ul class='projects'>PROJECTS";
    for (var j = 0; j < current.projects.length; j++) {

      html += "<li><a target='_blank' href='" + current.projects[j].target +
        "'>" + current.projects[j].name + "</a></li>";

    }
    html += "</ul>";
  }

  // LINKS
  if (current.links) {

    html += "<ul class='links'>LINKS";
    for (var j = 0; j < current.links.length; j++) {
      var link = current.links[j];
      // if (link.target === "automatype/p5/")
      html += "<li><a target='_blank' href='" + link.target +
        "'>" + link.name + "</a></li>";
    }
    html += "</ul>";
  }

  if (current.awards) {
    html += "<ul class='awards'>AWARDS";
    for (var j = 0; j < current.awards.length; j++) {
      html += "<li class='hanging'>";
      if (current.awards[j].target)
        html += "<a target='_blank' href='" + current.awards[j].target +
          "'>" + current.awards[j].text + "</a></li>";
      else
        html += current.awards[j].text + "</li>";
    }
    html += "</ul>";

  }

  // EXHIBITIONS
  if (current.exhibitions) {

    html += "<ul class='exhibitions'>EXHIBITIONS";
    for (var j = 0; j < current.exhibitions.length; j++) {
      html += "<li class='hanging'>";
      if (current.exhibitions[j].target)
        html += "<a target='_blank' href='" + current.exhibitions[j].target +
          "'>" + current.exhibitions[j].text + "</a></li>";
      else
        html += current.exhibitions[j].text + "</li>";
    }
    html += "</ul>";
  }

  // DETAIL IMAGE
  if (current.largeDetailImage) {
    html += "<img src='" + current.largeDetailImage.src + "' data-rjs='2' style='margin-left: 0px; max-width: 525px'/>";
    if (current.largeDetailImage.title) {
      html += "<p style='font-size:10px; margin-top:-5px'>Fig. " + current.largeDetailImage.title + "<strong/></p>";
    }
  }

  html += "</div>";
  html += "<div class='col-1-3 mobile-col-1-1'>";

  // MAIN IMAGE
  if (current.images) {

    var bestImage = getBestImage(current.images[0].src);
    var altInfo = current.images[0].title ? current.images[0].title : current.longtitle;
    html += "<a class='fancybox' href='" + bestImage + "'><img data-rjs='2' src='"
      + current.images[0].src + "' title='" + altInfo + "' alt='" + altInfo + "' ></a>";
  }

  // VIDEO
  if (current.videos) {

    for (var j = 0; j < current.videos.length; j++) {

      var id = current.shorttitle.toLowerCase().replace(/[ .-]+/g, '');
      html += "<a class='fancybox video clearfix' href='#" + id + "_" + j + "_video'>";
      html += "<img src='" + current.videos[j].poster + "' /><div class='play'></div></a>";
      if (current.videos[j].title) html += "<p>" + current.videos[j].title + "</p>";
      html += '<div id="' + id + "_" + j + '_video" class="fancybox-video"><video controls width="640px" height="auto">';
      html += '<source src="' + current.videos[j].src + '.mp4" type="video/mp4">';
      html += '<source src="' + current.videos[j].src + '.webm" type="video/webm">';
      html += '</video></div>';
    }
  }

  // OTHER IMAGES
  if (current.images) {

    for (var j = 1; j < current.images.length; j++) {
      var bestImage = getBestImage(current.images[j].src);
      var altInfo = current.images[j].title || current.images[j].hoverTitle || current.longtitle;
      html += "<a class='fancybox' title='" + altInfo + "' href='" + bestImage + "'><img src='" + current.images[j].src + "' alt='" + altInfo + "' ></a>";
    }
  }

  html += "</div></div></div>";

  // DETAIL PAGE: BOTTOM NAV
  html += "<div class='bottomNav'>";
  if (i != 0) {
    var last = idk - 1;
    if (projects[last].longdesc === undefined) {
      last -= 1;
    }
    html += "<p><span>previous</span><a href='#" +
      detailUrl(projects[last].shorttitle) + "'>" +
      projects[last].longtitle + "</a></p>";

  }

  var next = (idk + 1) % projects.length;
  if (projects[next].longdesc === undefined) {
    next += 1;
  }
  html += "<p class='nextPage'><span>next</span><a href='#" +
    detailUrl(projects[(next) % projects.length].shorttitle) +
    "'>" + projects[(next) % projects.length].longtitle + "</a></p>";

  html += "</div></div>";

  $('#detail').append(html);

  const newImages = $('#' + id + ' img')
  window.retinajs(newImages);
}

function adjustItemContent() {
  $('.project p').each(function () {
    while ($(this).height() > 115) {
      var text = $(this).text();
      var lastIndex = text.lastIndexOf(" ");
      var newText = text.substring(0, lastIndex);
      $(this).text(newText + "...");
      // console.log($(this).height());
    }
  })
}

function getBestImage(img) {

  return img.slice(0, img.length - 4) + "@2x" +
    img.slice(img.length - 4, img.length);
}

function adjustItemHeight(projects) {

  // max-width > 1100  - 4
  // max-width 1100    - 3
  // max-width 768     - 2
  // max-width 400     - 1

  var total = $('.project').length,
    cols = 4,
    windowWidth = $(window).width();

  if (windowWidth < 1100 && windowWidth > 768) cols = 3;
  else if (windowWidth < 768 && windowWidth > 400) cols = 2;
  else if (windowWidth < 400) cols = 1;

  // if the colomn doesn't change, return
  if (cols === lastCols) return;

  lastCols = cols;
  $('.project').removeClass(function (index, className) {
    return (className.match(/(^|\s)row\S+/g) || []).join(' ');
  });

  //no need to adjust Height if cols is 1
  if (cols === 1) return;

  var lines = Math.ceil(total / cols);

  // adjust the height to maxH for each line
  for (var j = 0; j < lines; j++) {

    var maxH = 0,
      classname = 'row' + j;
    for (var i = 0; i < cols; i++) {
      var index = j * cols + i;
      var current = $('.project').eq(index).outerHeight();
      // console.log(i,j);
      if (current > maxH) maxH = current;
      if (projects) {
        if (index + 1 > projects.length) break;
      }

      $('.project').eq(index).addClass(classname);
    }

    $('.' + classname).css("height", maxH);
  }
}

function muteSketch() {
  $('iframe').each(function () {
    $(this)[0].contentWindow.toggleMute(true);
  })
}

function unmuteSketch() {
  $('iframe').each(function () {
    $(this)[0].contentWindow.toggleMute(false);
  })
}

function adjustFooterSpace() {

  if ($('.footer').css("position") === "fixed")
    $('.space').css("height", $('.footer').outerHeight());
  else
    $('.space').css("height", "0px");
  // console.log($('.footer').css("position"), $('.footer').outerHeight());
}

function getCurrentIdFromUrl(url) {

  return url.split("#")[1];
}

function openNewWindow(url, name, feats) {

  window.open(url, name, feats);
}

function imageExists(image_url) {

  var http = new XMLHttpRequest();
  http.open('HEAD', image_url, false);
  http.send();
  return http.status != 404;
}

function openInTab(url) {
  window.open(url, '_blank');
  window.open(url);
}

$(document).ready(function () {

  //reload on resize
  /*
  $(window).bind('resize', function(e)
  {
    if (window.RT) clearTimeout(window.RT);
    window.RT = setTimeout(function()
    {
      this.location.reload(false); // false to get page from cache
    }, 100);
  });
*/


  window.addEventListener('focus', startFocus);   //Window active
  window.addEventListener('blur', stopFocus);   //Window inactive

  // mobile menu
  /*
  $('.name.showInMobile').click(function () {
    $('nav').slideToggle();
  });
  */

  $('.menubutton.showInMobile').click(function () {
    $('nav').slideToggle();
  });

  //  $(window).trigger('resize');

  //control bar for videos
  $('video').hover(function toggleControls() {
    if (this.hasAttribute("controls")) {
      this.removeAttribute("controls");
    } else {
      this.setAttribute("controls", "controls");
    }
  })

  // prevent default up/down key behaviour if sketch is present
  $(document).keydown(function (e) {
    if ($('iframe').length === 0) return;
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      e.preventDefault();
    }
  });
});


function startFocus() {
  //  console.log("Is Focused")
  unmuteSketch();
}

function stopFocus() {
  //  console.log("not Focused")
  muteSketch();
}

Array.prototype.swap = function (x, y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}

function shuffle(arr) {
  let newArray = arr.slice(),
    len = newArray.length,
    i = len;
  while (i--) {
    let p = parseInt(Math.random() * len),
      t = newArray[i];
    newArray[i] = newArray[p];
    newArray[p] = t;
  }
  return newArray;
}

function pickFeatureProjects(projs) {

  //const shuffled = featured.sort(() => 0.5 - Math.random());
  const shuffled = shuffle(featured);

  // Get sub-array of first n elements after shuffled
  let selected = shuffled.slice(0, 2);
  let selectedIdx = [];
  for (let i = 0; i < projs.length; i++) {
    const proj = projs[i];
    if (selected.indexOf(proj.shorttitle) > -1) {
      selectedIdx.push(i);
    }
  }
  projs.swap(0, selectedIdx[0]);
  projs.swap(3, selectedIdx[1]);
  return projs;
}

$(window).resize(function () {

  if ($('.project').length > 0) {
    //  $('.project img').css("height", $('.project img').width() * 0.65);
    //    this.location.reload(false); // false to get page from cache
    //    adjustItemHeight();
    //  adjustFooterSpace();
  }
  updateEventsLayout();
});

$.getJSON("projects.json").done((json) => {

  if ($('#projects').length > 0) {
    json = pickFeatureProjects(json);
    createGrid(json);
    createEventCol("https://rednoise.org/wpr/wp-json/wp/v2/posts?categories=2&per_page=20");
  }

  const images = $('img.project');
  // console.log(images);
  window.retinajs(images);

  if ($('#detail').length > 0) {
    createDetail(json, getCurrentIdFromUrl($(location).attr('href')));
  }

  window.onhashchange = function () {
    var id = getCurrentIdFromUrl($(location).attr('href'));
    createDetail(json, id);
  }
});
