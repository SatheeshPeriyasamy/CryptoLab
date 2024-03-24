$(document).ready(function () {
    // Scroll function
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) { // Change 50 to the desired scroll value
            $('header').addClass('scrolled');
        } else {
            $('header').removeClass('scrolled');
        }
    });

    // Filter function
    $(".filter-item").click(function () {
        const value = $(this).attr("data-filter");
        if (value == "all") {
            $(".post-box").show("1000");
        } else {
            $(".post-box").hide("1000").filter("." + value).show("1000");
        }
        $(this).addClass("active-filter").siblings().removeClass("active-filter");
    });
});
