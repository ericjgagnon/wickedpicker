(function($) {
    $('.smooth-scroll').on('click', function() {
            var target = $('#' + $(this).data('target'));
            $('html, body').stop().animate({
                'scrollTop': target.offset().top
            }, 1500, 'swing');
    })
})(jQuery);