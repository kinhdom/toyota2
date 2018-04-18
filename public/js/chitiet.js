$(document).ready(function () {
    $('.collapsible').collapsible();
    $(".owl-carousel").owlCarousel({
        stagePadding: 50,
        loop: true,
        margin: 20,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 2
            }
        }

    });
    $('.carousel').carousel({
        fullWidth: true,
        indicators: true,
        padding: 6,
        numVisible: 5
    });
    $('.tabs').tabs();
    $('.list-color ul li span').click(function (e) {
        $(this).parent().addClass('selected').siblings().removeClass('selected');
        $('.txt-color').text(e.target.attributes[1].value)
        $('#xe').attr('src', e.target.attributes[0].value)
    })
});