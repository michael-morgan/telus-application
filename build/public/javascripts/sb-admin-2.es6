//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $('#side-menu').metisMenu();

    let accordion = $('#accordion');
    accordion.on('hidden.bs.collapse', toggleAccordionIndicator);
    accordion.on('shown.bs.collapse', toggleAccordionIndicator);

    $(window).bind("load resize", function() {
        let topOffset = 50;
        let width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;

        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        let height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return (this.href.split("/")[this.href.split("/").length - 1])
             == (url.href.split("/")[url.href.split("/").length - 1]);
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});

function toggleAccordionIndicator(e) {
    $(e.target)
        .prev('.panel-heading')
        .find('i.indicator')
        .toggleClass('fa-chevron-down fa-chevron-right');
}
