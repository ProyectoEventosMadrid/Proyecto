// Variables
var bTransparent = true;

// Proceso
$(document).ready(function () {
    // Cambiar transparencia de la barra de navegacion
    if ($('.navbar[color-on-scroll]').length != 0) {
        $(window).on('scroll', fNavbar.checkScrollForTransparentNavbar)
    }

    // Obtener localStorage de sesion y si no existe, crearlo
    if (localStorage.Session == null) {
        var aSession = { "Sesion": false, "User": "", "Token": ""}; // Crear estructura del localStorage.Session
        localStorage.Session = JSON.stringify(aSession); // Crear el localStorage.Session
    } else {
        var aSession = JSON.parse(localStorage.Session); // Obtener en Array el localStorage.Session
    }

    // Control del boton de busqueda. Si no hay nadie logeado, desactivarlo
    if (!aSession["Sesion"]) { 
        $('#btn-filter').prop("disabled", true);
    } else {
        $('#btn-filter').prop("disabled", false);
    }

    // Control boton login/salir. Si hay alguien logeado mostrar solo el boton salir, sino mostrar solo el boton login
    if (aSession["Sesion"]) { 
        $('#btn-login').hide();
    } else {
        $('#btn-salir').hide();
    }

    // Obtener el Token del admin
    var sTokenAdmin = "";

    $.ajax({
        type: "POST",
        dataType: "html",
        async: false,
        url: `http://localhost:5000/api/Users/authenticate/username/paulac/password/1234`,
        headers: {
            "accept": "application/json",
        },
        success: function (response) {
            var aUsuario = JSON.parse(response);
            sTokenAdmin = aUsuario.token;
        }
    });

    // Obtener la lista de centros de los eventos
    var aCentros = [];

    $.ajax({
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

    // Añadir calendario al input de fecha
    $("#fecha-filter").datepicker({ dateFormat: 'dd/mm/yy' });
    Inputmask().mask("fecha-filter");

    // Añadir el autocomple al input de centros
    $("#centros-filter").autocomplete({
        source: aCentros
    });

    // Control click boton salir
    $('#btn-salir').on('click', function (ev) {
        var aSession = { "Sesion": false, "User": "", "Token": ""}; // Crear estructura del localStorage.Session
        localStorage.Session = JSON.stringify(aSession); // Crear el localStorage.Session

        window.location.href = "./index.html"; // Recargar pagina
    })
});

// Funciones de la barra de navegacion
// Efecto de transparencia dependiendo de la zona donde se encuentre
var fNavbar = {
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