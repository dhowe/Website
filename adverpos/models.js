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
  $('.modelView').append(html);

  displayCurrent();
}

$(document).ready(function() {

    var current = $('.modelView').attr('id');
    // console.log(current);

    $('video').hover(function toggleControls() {
        if (this.hasAttribute("controls")) {
            this.removeAttribute("controls")
        } else {
            this.setAttribute("controls", "controls")
        }
    })

    $('#still').click(function() {
      $('#imageDisplay').removeClass().addClass(current + "Still");
      $('#wilson .items').css("color", "white");
      $('#nicole .items').css("color", "#80807F");
      $('video').hide();
      $('.intro').css("background-color", "rgba(0,0,0,0)");
    })
    $('#detail').click(function() {
      $('#imageDisplay').removeClass().addClass(current + "Detail");
      $('video').hide();
      $('.items').css("color", "#EEE");
      $('.intro').css("background-color", "rgba(0,0,0,.5)");
    })
    $('#adCollection').click(function() {
      $('#imageDisplay').removeClass().addClass(current + "AdCollection");
       $('video').hide();
      $('.items').css("color", "#EEE");
      $('.intro').css("background-color", "rgba(16,60,83,.8)");
    })
    $('#animation').click(function() {
      $('#imageDisplay').removeClass();
       $('video').show();
      $('.items').css("color", "#EEE");
      $('.intro').css("background-color", "rgba(0,0,0,0)");
    })

});
