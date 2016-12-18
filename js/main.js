
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
  if (location.href.indexOf('/mit/') > -1) {
    $navlist.append('<li><a class="current" href="index.html">ACM/MIT: Selected Projects</a></li>');
  }
  else if (location.href.indexOf('/saic/') > -1) {
    $navlist.append('<li><a class="current" href="index.html">SAIC: Portfolio</a></li>');
  }
  else {
    $navlist.append('<li><a class="current" href="index.html">Projects</a></li>');
    $navlist.append('<li><a href="pubs.html">Publications</a></li>');
    $navlist.append('<!--li><a href="sketchpad/index.html">Sketchpad</a></li-->');
    $navlist.append('<li><a class="showInMobile" href="about.html">About</a></li>');
  }
}

function detailUrl(title) {

  return title.toLowerCase().replace(/[ .-]+/g,'');
}

function createDetail(projects) {

  selectNavigation();

  // LONG TEXT
  var html = "", nav = "";
  for (var i = 0; i < projects.length; i++) {

    html += "<div class='projectlong' id='" +
      detailUrl(projects[i].shorttitle) + "'><div class='grid'>";

    html += "<div class='content clearfix'><div class='col-8-12 mobile-col-1-1 gap'>";
    html += "<h5>" + projects[i].longtitle + "</h5>";
    html += "<p class='longdesc'>" + projects[i].longdesc + "</p>";

    // QUOTES
    if (projects[i].quotes) {
       html += "<div class='quotes'>";
      for (var j = 0; j < projects[i].quotes.length; j++) {
        //<li><a href="">XXX</a></li>
          html += "<p>&quot<i>" + projects[i].quotes[j].text + "</i>&quot";
          html += "<span>- " + projects[i].quotes[j].from + "</span></p>";
      }
      html += "</div>";
    }

    // LINKS
    if (projects[i].links) {

      html += "<ul class='links'>LINKS";
      for (var j = 0; j < projects[i].links.length; j++) {
        html += "<li><a target='_blank' href='" + projects[i].links[j].target +
          "'>" + projects[i].links[j].name + "</a></li>";
      }
      html += "</ul>";
    }

    // RELATED PROJECTS
    if (projects[i].projects) {

      html += "<ul class='projects'>PROJECTS";
      for (var j = 0; j < projects[i].projects.length; j++) {

          html += "<li><a target='_blank' href='" + projects[i].projects[j].target
            + "'>" + projects[i].projects[j].name + "</a></li>";

      }
      html += "</ul>";
    }

    // EXHIBITIONS
    if (projects[i].exhibitions) {

      html += "<ul class='exhibitions'>EXHIBITIONS";
      for (var j = 0; j < projects[i].exhibitions.length; j++) {
        html += "<li class='hanging'>";
        if (projects[i].exhibitions[j].target)
          html += "<a target='_blank' href='" + projects[i].exhibitions[j].target
            + "'>" + projects[i].exhibitions[j].text + "</a></li>";
        else
          html += projects[i].exhibitions[j].text + "</li>";
      }
      html += "</ul>";
    }

    html += "</div>";

    
     html += "<div class='col-1-3 mobile-col-1-1'>";

    // MAIN IMAGE
  if (projects[i].images) {

          var bestImage = projects[i].images[0].slice(0, projects[0].images[0].length - 3) +
              "@2x" + projects[i].images[0].slice(projects[i].images[0].length - 4, projects[i].images[0].length);

          // if(!imageExists(bestImage)) bestImage = projects[i].images[j];console.log(bestImage);
          html += "<a class='fancybox' rel='group' href='" + bestImage + "'><img src=" + projects[i].images[0] + "></a>";
  }

  //VIDEO
          if (projects[i].videos) {
              for (var j = 0; j < projects[i].videos.length; j++) {
                  html += "<a class='fancybox' href='#single-video'>";
                  html += "<img src='" + projects[i].videos[j].poster + "' /> </a>";
                  html += '<div id="single-video" class="fancybox-video"><video controls width="100%" height="auto"><source src="' + projects[i].videos[j].src + '.mp4" type="video/mp4">  </video></div>'

                  // html += "<div class='video'><video preload='auto' class='animation' loop controls='controls' "
                  // if (projects[i].videos[j].poster)
                  //     html += "poster='" + projects[i].videos[j].poster;
                  // html += "''>";

                  // html += " <source src='" + projects[i].videos[j].src + ".webm' type='video/webm'>";
                  // html += " <source src='" + projects[i].videos[j].src + ".mp4' type='video/mp4'></video>";
                  // html += "<div class='playpause'></div> </div>";
              }
          }
   
//OTHER IMAGES
if (projects[i].images) {
      for (var j = 1; j < projects[i].images.length; j++) {
          var bestImage = projects[i].images[j].slice(0, projects[i].images[j].length - 4) +
              "@2x" + projects[i].images[j].slice(projects[i].images[j].length - 4, projects[i].images[j].length);

          // if(!imageExists(bestImage)) bestImage = projects[i].images[j];console.log(bestImage);
          html += "<a class='fancybox' rel='group' href='" + bestImage + "'><img src=" + projects[i].images[j] + "></a>";
      }
  }

    html += "</div></div></div>";


    html += "<div class='bottomNav'>";
    if (i != 0) {
        html += "<p><span>previous</span><a href='#" +
          detailUrl(projects[i - 1].shorttitle) + "'>" +
          projects[i - 1].longtitle + "</a></p>";
    }

    html += "<p class='nextPage'><span>next</span><a href='#" +
      detailUrl(projects[(i + 1) % projects.length].shorttitle) +
      "'>" + projects[(i + 1) % projects.length].longtitle + "</a></p>";

    html += "</div></div>";
  }

  $('#detail').append(html);

  displayCurrent();
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

function displayCurrent() {

  var URL = $(location).attr('href');
  var id = URL.split("#")[1];
  var selector = '.projectlong#' + id;
  //console.log('displayCurrent:'+id,selector);
  $(".projectlong").css("display", "none");
  $(selector).css("display", "block");
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
       console.log("load");
  //control bar for videos
   $('video').hover(function toggleControls() {
     console.log("hover");
        if (this.hasAttribute("controls")) {
            this.removeAttribute("controls");
        } else {
            this.setAttribute("controls", "controls");
            
        }
    })
  
});


$(document).on('click', '.bottomNav a', function () {

  var link = $(this).attr("href");
  //console.log(link);
  var id = link.split("#")[1];
  var selector = '.projectlong#' + id;
  $(".projectlong").css("display", "none");
  $(selector).css("display", "block");
});

$(window).resize(function () {
  $('.project img').css("height", $('.project img').width() * 0.65);
  $('.space').css("height", $('.footer').outerHeight());
});

// lets run some code...

var projects, processJSON = $.getJSON("projects.json", function (json) {
  projects = json.cells;
});

processJSON.done(function (projects) {
  if ($('#projects').length > 0) createGrid(projects);
  if ($('#detail').length > 0) createDetail(projects);
});
