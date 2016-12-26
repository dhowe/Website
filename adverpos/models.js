
$(document).ready(function() {
    var current =  $('.modelView').attr('id')
    // console.log(current);

    $('video').hover(function toggleControls() {
        if (this.hasAttribute("controls")) {
            this.removeAttribute("controls")
        } else {
            this.setAttribute("controls", "controls")
        }
    })
    
    $('.items li').click(function() {
       $('.items li').removeClass("current");
       $(this).addClass("current");
    });

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

    if(document.location.hash != undefined){
      $(document.location.hash).trigger("click");
      // console.log(document.location.hash, "click");
    }

});
