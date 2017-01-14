var projects;

function createGrid(projects) {

  // create grid in html
  for (var i = 0; i < projects.length; i++) {

    var html = "<a href='detail.html#" + detailUrl(projects[i].shorttitle) + "'>";
    html += "<div class='project'>";
    html += "<h5>" + projects[i].shorttitle + "</h5>";
    html += "<img src=" + projects[i].thumb + ">";
    html += "<p>" + projects[i].shortdesc + "</p>";
    if (projects[i].collaborators) {
      html += "<p class='collaborators'> w' " + projects[i].collaborators + "</p>";
    }
    html += "</div></a>";

    $('#projects .grid').append(html);
  }

  $('.project img').css("height", $('.project img').width() * 0.65);

  adjustHeight(projects);
  selectNavigation();

  // footer space
  if ($('.footer').css("display") != "none") {
    $('#projects .grid').append("<div class='space' style='height:"
      + $('.footer').outerHeight() + "'></div>");
  }
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
    $navlist.html('<li><a class="current" href="index.html">Tandon: Portfolio</a></li>');
}

function detailUrl(title) {

  return title.toLowerCase().replace(/[ .-]+/g,'');
}

function createDetail(projects, id) {

  selectNavigation();
  //hide the previous
  $('.projectlong').hide();

  var current, idk = 0;

  for (var i = 0; i < projects.length; i++) {
    var title = projects[i].shorttitle.toLowerCase().replace(/[ .-]+/g, '');
      if ( title === id) {
        current = projects[i]
        idk = i;
        break;
      };
  }

  //if the div is already created, show the div
  if ($('.projectlong#' + id).length > 0){
    $('.projectlong#' + id).show();
    return;
  }

  //if not, create the div
  /***************************** CREATE *****************************/


    var html = "", nav = "";
    html += "<div class='projectlong' id='" +
    detailUrl(current.shorttitle) + "'><div class='grid'>";
    html += "<div class='content clearfix'><div class='col-8-12 mobile-col-1-1 gap'>";
    html += "<h5>" + current.longtitle + "</h5>";

      // LONG TEXT
    html += "<p class='longdesc'>" + current.longdesc + "</p>";

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

    // LINKS
    if (current.links) {

      html += "<ul class='links'>LINKS";
      for (var j = 0; j < current.links.length; j++) {
        html += "<li><a target='_blank' href='" + projects[i].links[j].target +
          "'>" + current.links[j].name + "</a></li>";
      }
      html += "</ul>";
    }

    // RELATED PROJECTS
    if (current.projects) {

      html += "<ul class='projects'>PROJECTS";
      for (var j = 0; j < current.projects.length; j++) {

          html += "<li><a target='_blank' href='" + current.projects[j].target
            + "'>" + current.projects[j].name + "</a></li>";

      }
      html += "</ul>";
    }


    // EXHIBITIONS
    if (current.exhibitions) {

      html += "<ul class='exhibitions'>EXHIBITIONS";
      for (var j = 0; j < current.exhibitions.length; j++) {
        html += "<li class='hanging'>";
        if (current.exhibitions[j].target)
          html += "<a target='_blank' href='" + current.exhibitions[j].target
            + "'>" + current.exhibitions[j].text + "</a></li>";
        else
          html += current.exhibitions[j].text + "</li>";
      }
      html += "</ul>";
    }

    html += "</div>";
    html += "<div class='col-1-3 mobile-col-1-1'>";

    // MAIN IMAGE
  if (current.images) {

          var bestImage = getBestImage(current.images[0].src);
          var altInfo = current.images[0].title? current.images[0].title : current.longtitle;
          html += "<a class='fancybox' rel='group' href='" + bestImage + "'><img src='" + current.images[0].src + "' alt='" + altInfo + "' ></a>";
  }

  //VIDEO
  if (current.videos) {
      for (var j = 0; j < current.videos.length; j++) {
          var id = current.shorttitle.toLowerCase().replace(/[ .-]+/g, '');

          html += "<a class='fancybox video clearfix' href='#" + id + "_video'>";
          html += "<img src='" + current.videos[j].poster + "' /><div class='play'></div></a>";
          if(current.videos[j].title) html += "<p>" + current.videos[j].title + "</p>";
          html += '<div id="' + id + '_video" class="fancybox-video"><video controls width="640px" height="auto"><source src="' + current.videos[j].src + '.mp4" type="video/mp4">  </video></div>';

      }
  }

  //OTHER IMAGES
  if (current.images) {
        for (var j = 1; j < current.images.length; j++) {
            var bestImage = getBestImage(current.images[j].src);
            var altInfo = current.images[j].title ? current.images[j].title : current.longtitle;
            html += "<a class='fancybox' href='" + bestImage + "'><img src='" + current.images[j].src  + "' alt='" + altInfo + "' ></a>";
        }
    }

    html += "</div></div></div>";

    //DETAIL PAGE: BOTTOM NAV
    html += "<div class='bottomNav'>";
    if (i != 0) {
        html += "<p><span>previous</span><a href='#" +
          detailUrl(projects[idk - 1].shorttitle) + "'>" +
          projects[idk - 1].longtitle + "</a></p>";
    }

    html += "<p class='nextPage'><span>next</span><a href='#" +
      detailUrl(projects[(idk + 1) % projects.length].shorttitle) +
      "'>" + projects[(idk + 1) % projects.length].longtitle + "</a></p>";

    html += "</div></div>";


  $('#detail').append(html);
}

function getBestImage(img){
  return img.slice(0, img.length - 4) + "@2x" + img.slice(img.length - 4, img.length);
}

function adjustHeight(projects) {

  //adjust the height of each project
  var maxH = 0;
  for (var i = 0; i < projects.length; i++) {
    var current = $('.project').eq(i).outerHeight();
    // console.log(current);
    if (current > maxH) maxH = current;
  }
  // console.log(maxH);
  $('.project').addClass('maxH');
  $('.maxH').css("height", maxH);
}

function getCurrentIdFromUrl(url) {
  return url.split("#")[1];
}

function openNewWindow(URLtoOpen, windowName, windowFeatures) {
  window.open(URLtoOpen, windowName, windowFeatures);
}

function imageExists(image_url){
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
}

$(document).ready(function () {

  // mobile menu
  $('.name.showInMobile').click(function () {
    $('nav').slideToggle();
  });

  $(window).trigger('resize');

  //control bar for videos
   $('video').hover(function toggleControls() {
        if (this.hasAttribute("controls")) {
            this.removeAttribute("controls");
        } else {
            this.setAttribute("controls", "controls");

        }
    })

});

window.onhashchange = function() {
    var id = getCurrentIdFromUrl($(location).attr('href'));
    createDetail(projects, id);
}

$(window).resize(function () {
  $('.project img').css("height", $('.project img').width() * 0.65);
  $('.space').css("height", $('.footer').outerHeight());
});

// lets run some code...

var projects, processJSON = $.getJSON("projects.json", function (json) {
  projects = json.cells;
});


processJSON.done(function (projs) {
  projects = projs;
  if ($('#projects').length > 0) createGrid(projects);
  if ($('#detail').length > 0) createDetail(projects, getCurrentIdFromUrl($(location).attr('href')));
});
