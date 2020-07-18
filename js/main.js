
const featured = [ // min image size 1100px
  "Spectre", "Big Dada", "AdNauseam", "How It Is", "Automatype", "Radical of the Vertical Heart 忄", "The Readers Project"
];

let lastCols = 0;

function createGrid(projects) {

  let noOfSpecialLayout = 6;
  let gridSmall = "s", gridLarge = "l", gridLargeRight = "lr";
  
  // create grid in html
  for (let html, i = 0; i < projects.length; i++) {
    let g;

    if (i % 6 === 0 && i < noOfSpecialLayout) {
      g = gridLarge;
    } else if (i % 6 === 3 && i < noOfSpecialLayout) {
      g = gridLargeRight;
    }
    else {
      g = gridSmall;
    }

    html = "<a href='" + projLink(projects[i]) + "'>";
    html += "<div class='project gridSize-" + g + "'>";
    let fontCheck = projects[i].shorttitle.length > 28 ? " class='smallerTitle'" : "";

    html += "<img data-rjs='2' src=" + projects[i].thumb + ">";
    html += "<div class='project-description'>";
    html += "<h5" + fontCheck + ">" + projects[i].shorttitle + "</h5>";
    html += "<p>" + projects[i].shortdesc + "</p>";
    html += "</div></a>";
    html += "</div>";
    //console.log(html);
    $('#projects .grid').append(html);
  }

  $('#projects .grid').append("<div class='space'></div>");
  //  afterGridCreated(projects);
}

function afterGridCreated(projects) {

  $('.project img').css("height", $('.project img').width() * 0.65);
  adjustItemHeight(projects);
  adjustFooterSpace();
  selectNavigation();
}

function selectNavigation() {

  let $navlist = $('#navlist');
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
  else return proj.longdesc ? 'detail.html#' + detailUrl(proj.shorttitle) : "";
}


function detailUrl(title) {

  return title.toLowerCase().replace(/[ .-]+/g, '');
}

function createDetail(projects, id) {

  selectNavigation();

  // hide the previous
  $('.projectlong').hide();

  let current, idk = 0;

  for (let i = 0; i < projects.length; i++) {
    let title = projects[i].shorttitle.toLowerCase().replace(/[ .-]+/g, '');
    if (title === id) {
      current = projects[i]
      idk = i;
      break;
    };
  }

  // wrong id or no id
  if (current === undefined) window.location.href = 'index.html';


  // if the div is already created, show the div
  if ($('.projectlong#' + id).length > 0) {
    $('.projectlong#' + id).show();
    return;
  }

  // if not, create the div
  let html = "",
    nav = "";
  html += "<div class='projectlong' id='" +
    detailUrl(current.shorttitle) + "'><div class='grid'>";
  html += "<div class='content clearfix'><div class='col-8-12 mobile-col-1-1 gap'>";
  html += "<h5>" + current.longtitle + "</h5>";
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
    for (let j = 0; j < current.quotes.length; j++) {
      //<li><a href="">XXX</a></li>
      html += "<p>&quot<i>" + current.quotes[j].text + "</i>&quot";
      html += "<span>- " + current.quotes[j].from + "</span></p>";
    }
    html += "</div>";
  }

  // IFRAME SKETCH
  if (current.sketch) {
    html += "<iframe id='" + current.shorttitle + "_sketch' name='sketch' src='" + current.sketch + "'></iframe>";
    // mute sketch whenever a link redirect is triggered on current detailed page
    html += "<script type='text/javascript'>if (getCurrentIdFromUrl($(location).attr('href')) == '" + current.shorttitle.toLowerCase() + "') $('a').click(function(){muteSketch()});</script>";
  }

  // LINKS
  if (current.links) {

    html += "<ul class='links'>LINKS";
    for (let j = 0; j < current.links.length; j++) {
      let link = current.links[j];
      // if (link.target === "automatype/p5/")
      html += "<li><a target='_blank' href='" + link.target +
        "'>" + link.name + "</a></li>";
    }
    html += "</ul>";
  }

  // RELATED PROJECTS
  if (current.projects) {

    html += "<ul class='projects'>PROJECTS";
    for (let j = 0; j < current.projects.length; j++) {

      html += "<li><a target='_blank' href='" + current.projects[j].target +
        "'>" + current.projects[j].name + "</a></li>";

    }
    html += "</ul>";
  }

  // EXHIBITIONS
  if (current.exhibitions) {

    html += "<ul class='exhibitions'>EXHIBITIONS";
    for (let j = 0; j < current.exhibitions.length; j++) {
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

    let bestImage = getBestImage(current.images[0].src);
    let altInfo = current.images[0].title ? current.images[0].title : current.longtitle;
    html += "<a class='fancybox' href='" + bestImage + "'><img data-rjs='2' src='"
      + current.images[0].src + "' title='" + altInfo + "' alt='" + altInfo + "' ></a>";
  }

  // VIDEO
  if (current.videos) {

    for (let j = 0; j < current.videos.length; j++) {

      let id = current.shorttitle.toLowerCase().replace(/[ .-]+/g, '');
      html += "<a class='fancybox video clearfix' href='#" + id + "_video'>";
      html += "<img src='" + current.videos[j].poster + "' /><div class='play'></div></a>";
      if (current.videos[j].title) html += "<p>" + current.videos[j].title + "</p>";
      html += '<div id="' + id + '_video" class="fancybox-video"><video controls width="640px" height="auto">';
      html += '<source src="' + current.videos[j].src + '.mp4" type="video/mp4">';
      html += '<source src="' + current.videos[j].src + '.webm" type="video/webm">';
      html += '</video></div>';
    }
  }

  // OTHER IMAGES
  if (current.images) {

    for (let j = 1; j < current.images.length; j++) {
      let bestImage = getBestImage(current.images[j].src);
      let altInfo = current.images[j].title || current.images[j].hoverTitle || current.longtitle;
      html += "<a class='fancybox' title='" + altInfo + "' href='" + bestImage + "'><img src='" + current.images[j].src + "' alt='" + altInfo + "' ></a>";
    }
  }

  html += "</div></div></div>";

  // DETAIL PAGE: BOTTOM NAV
  html += "<div class='bottomNav'>";
  if (i != 0) {
    let last = idk - 1;
    if (projects[last].longdesc === undefined) {
      last -= 1;
    }
    html += "<p><span>previous</span><a href='#" +
      detailUrl(projects[last].shorttitle) + "'>" +
      projects[last].longtitle + "</a></p>";

  }

  let next = (idk + 1) % projects.length;
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

function getBestImage(img) {

  return img.slice(0, img.length - 4) + "@2x" +
    img.slice(img.length - 4, img.length);
}

function adjustItemHeight(projects) {

  // max-width > 1100  - 4
  // max-width 1100    - 3
  // max-width 768     - 2
  // max-width 400     - 1

  let total = $('.project').length,
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

  let lines = Math.ceil(total / cols);

  // adjust the height to maxH for each line
  for (let j = 0; j < lines; j++) {

    let maxH = 0,
      classname = 'row' + j;
    for (let i = 0; i < cols; i++) {
      let index = j * cols + i;
      let current = $('.project').eq(index).outerHeight();
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

  let http = new XMLHttpRequest();
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
  let b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}

function pickFeatureProjects(projs) {

  // Shuffle array
  const shuffled = shuffle(featured);
  const selected = shuffled.slice(0, 2);

  const selectedIdx = [];
  for (let i = 0; i < projs.length; i++) {
    const proj = projs[i];
    if (selected.indexOf(proj.shorttitle) > -1) {
      selectedIdx.push(i);
    }
  }

  projs.swap(0, selectedIdx[0]);
  projs.swap(3, selectedIdx[1]);
}

$(window).resize(function () {
/*   if ($('.project').length > 0) {
    //  $('.project img').css("height", $('.project img').width() * 0.65);
    //    this.location.reload(false); // false to get page from cache
    //    adjustItemHeight();
    //  adjustFooterSpace();
  } */
});

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

$.getJSON("projects.json").done((projs) => {

  if ($('#projects').length > 0) {
    pickFeatureProjects(projs);
    createGrid(projs);
  }

  const images = $('img');
  window.retinajs(images);

  if ($('#detail').length > 0) {
    createDetail(projs, getCurrentIdFromUrl($(location).attr('href')));
  }

  window.onhashchange = function () {
    let id = getCurrentIdFromUrl($(location).attr('href'));
    createDetail(projs, id);
  }
});
