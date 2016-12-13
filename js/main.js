
function createGrid(projects) {

  // create grid in html
  for (var i = 0; i < projects.length; i++) {
    var html = "<a href='detail.html#" + detailUrl(projects[i].shorttitle) + "'> <div class='project'>";
    html += "<h5>" + projects[i].shorttitle + "</h5>";
    html += "<img src=" + projects[i].thumb + ">";
    html += "<p>" + projects[i].shortdesc + "</p>";
    if (projects[i].collaborators) html += "<p class='collaborators'> W' " + projects[i].collaborators + "</p>";
    html += "</div></a>";
    $('#projects .grid').append(html);
  }

  $('.project img').css("height", $('.project img').width() * 0.65);
  adjustHeight(projects);

  // footer space
  if ($('.footer').css("display") != "none")
    $('#projects .grid').append("<div class='space' style='height:" + $('.footer').outerHeight() + "'></div>");
}

function detailUrl(title) {
  return title.toLowerCase().replace(/[ .-]+/g,'');
}

function createDetail(projects) {

  // create long text
  var html = "";
  for (var i = 0; i < projects.length; i++) {

    html += "<div class='projectlong' id='" + detailUrl(projects[i].shorttitle) + "'><div class='grid pad-sl'>";

    html += "<div class='content'><div class='col-1-12'></div><div class='col-7-12 mobile-col-1-1'>";
    html += "<h5>" + projects[i].longtitle + "</h5>";
    html += "<p>" + projects[i].longdesc + "</p>";

    if (projects[i].links) {

      html += "<ul>LINKS";
      for (var j = 0; j < projects[i].links.length; j++) {
        //<li><a href="">XXX</a></li>
        html += "<li><a target='_blank' href='" + projects[i].links[j].target + "'>" + projects[i].links[j].name + "</a></li>";
      }
      html += "</ul>";
    }

    html += "</div>";
    html += "<div class='col-1-3 mobile-col-1-1'><img src=" + projects[i].image + "></div></div>";
    html += "<div class='bottomNav'>";

    if (i != 0)
      html += "<p><span>previous</span><a href='#" + (i - 1) + "'>" + projects[i - 1].longtitle + "</a></p>";

    if (i != projects.length - 1)
      html += "<p class='nextPage'><span>next</span><a href='#" + (i + 1) + "'>" + projects[i + 1].longtitle + "</a></p>";

    html += "</div></div></div>";
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
  console.log('displayCurrent:'+id,selector);
  $(".projectlong").css("display", "none");
  $(selector).css("display", "block");
}

function openNewWindow(URLtoOpen, windowName, windowFeatures) {

  window.open(URLtoOpen, windowName, windowFeatures);
}

$(document).ready(function () {

  // mobile menu
  $('.name.showInMobile').click(function () {
    $('nav').slideToggle();
  });
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
  if ($('#projects').length) createGrid(projects);
  if ($('#detail').length) createDetail(projects);
});
