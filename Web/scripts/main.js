// Funciones de la barra de navegacion
// Efecto de transparencia dependiendo de la zona donde se encuentre
var bTransparent = true;

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
            if (bTransparent) {
                bTransparent = false;
                $('.navbar[color-on-scroll]').removeClass('navbar-transparent');
            }
        } else {
            if (!bTransparent) {
                bTransparent = true;
                $('.navbar[color-on-scroll]').addClass('navbar-transparent');
            }
        }
    }, 17),
};

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

// Funcion para el filtro de busqueda
// Autocompleta el input busqueda y pone un calendario al input fecha
$(document).ready(function () {
    var sTokenAdmin = "";

    $.ajax({ // Obtener el token del admin
        type: "POST",
        dataType: "html",
        async: false,
        url: `http://localhost:5000/api/Users/authenticate/username/pauca/password/1234`,
        headers: {
            "accept": "application/json",
        },
        success: function (response) {
            var aUsuario = JSON.parse(response);
            sTokenAdmin = aUsuario.token;
        }
    });

    var aCentros = [];

    $.ajax({ // Obtener la lista de centros de los eventos
        type: "GET",
        dataType: "html",
        async: false,
        url: `http://localhost:5000/api/Eventos/Centros`,
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer " + sTokenAdmin
        },
        success: function (response) {
            var aRespuestaCentros = JSON.parse(response);

            aRespuestaCentros.forEach(centro => {
                aCentros.push(centro.organizacion);
            });
        }
    });

    $("#fecha-filter").datepicker({ dateFormat: 'dd/mm/yy' });
    Inputmask().mask("fecha-filter");

    $("#centros-filter").autocomplete({
        source: aCentros
    });
});
