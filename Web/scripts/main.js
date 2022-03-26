// Variables

var transparent = true;

// Funciones de la barra de navegacion
// Efecto de transparencia dependiendo de la zona donde se encuentre

$(document).ready(function () {
    // Cambio de color de la barra de navegación al desplazarse
    if ($('.navbar[color-on-scroll]').length != 0) {
        $(window).on('scroll', pk.checkScrollForTransparentNavbar)
    }
});

var pk = {
    misc: {
        navbar_menu_visible: 0
    },
    checkScrollForTransparentNavbar: debounce(function () {
        if ($(document).scrollTop() > $(".navbar").attr("color-on-scroll")) {
            if (transparent) {
                transparent = false;
                $('.navbar[color-on-scroll]').removeClass('navbar-transparent');
            }
        } else {
            if (!transparent) {
                transparent = true;
                $('.navbar[color-on-scroll]').addClass('navbar-transparent');
            }
        }
    }, 17),
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
};