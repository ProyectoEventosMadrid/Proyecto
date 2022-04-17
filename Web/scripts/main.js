const { Alert } = require("bootstrap");

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

    // Añadir el autocomplete al input de centros
    $("#centros-filter").autocomplete({
        source: aCentros
    });

    // Control click boton salir
    $('#btn-salir').on('click', function (ev) {
        var aSession = { "Sesion": false, "User": "", "Token": ""}; // Crear estructura del localStorage.Session
        localStorage.Session = JSON.stringify(aSession); // Crear el localStorage.Session

        window.location.href = "./index.html"; // Recargar pagina
    })

    // Control click boton buscar
    $('#btn-filter').on('click', function (ev) {
        ev.preventDefault();

        var aEventos = [];  
        var sCentros = $('#centros-filter').val();
        var sFecha = $('#fecha-filter').val();

        var aFecha = sFecha.split('/');
        var sFechaFormateada = `${aFecha[2]}-${aFecha[1]}-${aFecha[0]}`;

        // Obtener array con los eventos
        if (sCentros != "" && sFecha == "") { // Si solo esta rellenado el campo centros
            aEventos = ObtenerEventosCentro(sCentros, sTokenAdmin);
        } else if (sCentros == "" && sFecha != "") { // Si solo esta rellenado el campo fecha
            aEventos = ObtenerEventosFecha(sFechaFormateada, sTokenAdmin);
        } else if (sCentros != "" && sFecha != "") { // Si esta rellenado ambos campos
            aEventos = ObtenerEventosFechaCentro(sFechaFormateada, sCentros, sTokenAdmin);
        } else { // Si no esta rellenado ningun campo
            aEventos = ObtenerEventos(100, sTokenAdmin);
        }
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

// Funciones del filtro de busqueda
// Devuelven un array con los eventos que se desean obtener
function ObtenerEventosFecha(sFecha, sTokenAdmin) {
    let aEventos = [];

    $.ajax({
        type: "GET",
        dataType: "html",
        async: false,
        url: `http://localhost:5000/api/Eventos/FechaInicio/${sFecha}`,
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer " + sTokenAdmin
        },
        success: function (response) {
            let aRespuesta = JSON.parse(response);

            aRespuesta.forEach(evento => {
                aEventos.push(evento);
            });
        },
        error: function (response) {
            alert("Introduce una fecha valida.");
        }
    });

    return aEventos;
}

function ObtenerEventosCentro(sCentro, sTokenAdmin) {
    let aEventos = [];

    $.ajax({
        type: "GET",
        dataType: "html",
        async: false,
        url: `http://localhost:5000/api/Eventos/Centros/${sCentro}`,
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer " + sTokenAdmin
        },
        success: function (response) {
            let aRespuesta = JSON.parse(response);

            aRespuesta.forEach(evento => {
                aEventos.push(evento);
            });
        },
        error: function (response) {
            alert("Introduce un centro valida.");
        }
    });

    return aEventos;
}

function ObtenerEventosFechaCentro(sFecha, sCentro, sTokenAdmin) {
    let aEventos = [];

    $.ajax({
        type: "GET",
        dataType: "html",
        async: false,
        url: `http://localhost:5000/api/Eventos/Centros/${sCentro}/FechaInicio/${sFecha}`,
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer " + sTokenAdmin
        },
        success: function (response) {
            let aRespuesta = JSON.parse(response);

            aRespuesta.forEach(evento => {
                aEventos.push(evento);
            });
        },
        error: function (response) {
            alert("Introduce una fecha y/o centro validos.");
        }
    });

    return aEventos;
}

function ObtenerEventos(nCantidad, sTokenAdmin) {
    let aEventos = [];

    $.ajax({
        type: "GET",
        dataType: "html",
        async: false,
        url: `http://localhost:5000/api/Eventos`,
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer " + sTokenAdmin
        },
        success: function (response) {
            let aRespuesta = JSON.parse(response);

            for (let index = 0; index < nCantidad; index++) {
                aEventos.push(aRespuesta[index]);
            }
        }
    });

    return aEventos;
}