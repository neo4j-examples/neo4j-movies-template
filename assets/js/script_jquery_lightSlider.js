$(document).ready(function() {
    var autoplaySlider = $('#content-action').lightSlider({
        item:5,
        auto:true,
        loop:true,
        speed:1000,
        pauseOnHover: true,
        onBeforeSlide: function (el) {
            $('#current').text(el.getCurrentSlideCount());
        } 
    });
    $('#total').text(autoplaySlider.getTotalSlideCount());
});

$(document).ready(function() {
    var autoplaySlider = $('#content-drama').lightSlider({
        item:5,
        auto:true,
        loop:true,
        speed:800,
        pauseOnHover: true,
        onBeforeSlide: function (el) {
            $('#current').text(el.getCurrentSlideCount());
        } 
    });
    $('#total').text(autoplaySlider.getTotalSlideCount());
});

$(document).ready(function() {
    var autoplaySlider = $('#content-fantasy').lightSlider({
        item:5,
        auto:true,
        loop:true,
        speed:600,
        pauseOnHover: true,
        onBeforeSlide: function (el) {
            $('#current').text(el.getCurrentSlideCount());
        } 
    });
    $('#total').text(autoplaySlider.getTotalSlideCount());
});