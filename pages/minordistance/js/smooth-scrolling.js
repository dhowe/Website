jQuery('a').each( function() {
    var $this = jQuery(this), 
        target = this.hash;
    jQuery(this).click(function (e) { 
        e.preventDefault();
        if( $this.length > 0 ) {
            if($this.attr('href') == '#' ) {
                // Do nothing   
            } else {
               jQuery('html, body').animate({ 
                    scrollTop: (jQuery(target).offset().top)
                    
                }, 1000);
            }  
        }
    });
});