var zoomMode = false;

$(document).ready(function() {

   if(isMobile()) 
     $('body').addClass(current + "mobile");
    
    resetDisplayMinHeight();
    menuOnClicks();
    videoControl();
    zoomableImage();

    if(document.location.hash != undefined){
      $(document.location.hash).trigger("click");
      // console.log(document.location.hash, "click");
    }

});

window.onresize = function(event) {
  resetDisplayMinHeight();
};

function resetDisplayMinHeight() {
   var minW = $(window).height() *16/9;
   $('#imageDisplay').css("min-width", minW+"px");
}

function isMobile () {
  return navigator.userAgent.match(/Mobile|Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
};

function menuOnClicks () {
   var current =  $('.modelView').attr('id')
    // console.log(current);

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
        $('img.zoom').css("visibility", "hidden");
    })
    $('#detail').click(function() {
        $('#imageDisplay').removeClass().addClass(current + "Detail");
        $('video').hide();
        $('.items').css("color", "#EEE");
        $('.intro').css("background-color", "rgba(0,0,0,.5)");
        $('img.zoom').css("visibility", "hidden");
    })
    $('#adCollection').click(function() {
        $('#imageDisplay').removeClass().addClass(current + "AdCollection");
        $('video').hide();
        $('.items').css("color", "#EEE");
        $('.intro').css("background-color", "rgba(16,60,83,.8)");
        if (!zoomMode) $('img.zoom').css("visibility", "hidden");
        else $('img.zoom').css("visibility", "visible");
    })
    $('#animation').click(function() {
        $('#imageDisplay').removeClass();
        $('video').show();
        $('.items').css("color", "#EEE");
        $('.intro').css("background-color", "rgba(0,0,0,0)");
        $('img.zoom').css("visibility", "hidden");
    })
}

function videoControl () {
  $('video').hover(function toggleControls() {
        if (this.hasAttribute("controls")) {
            this.removeAttribute("controls")
        } else {
            this.setAttribute("controls", "controls")
        }
    })
}

function zoomableImage () {
  //show zoomable detailed collection image
  if (isMobile() && isMobile().length > 0) {
       $('#hint').css("display", "none");
    }
      else {
        $('#imageDisplay').click(function() {
            if ($('#imageDisplay').hasClass("nicoleAdCollection") || $('#imageDisplay').hasClass("wilsonAdCollection")) {
                $('img.zoom').css("visibility", "visible");

                if ($('body').height() > 630) {
                    $('img.zoom').height($('body').height());
                } else $('img.zoom').height(630);


            }

        })
    } 
    
    if (!zoomMode) {
        $('#imageDisplay').on('mousemove', function(e) {
            $('#imageDisplay.nicoleAdCollection, #imageDisplay.wilsonAdCollection').click(function() {
                $('#hint').css("display", "none");
                zoomMode = true;
            });

            $('#hint').css({
                left: e.pageX - 130,
                top: e.pageY - 40
            });
        });
    }
}