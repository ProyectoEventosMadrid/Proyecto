const { Alert } = require("bootstrap");

// Variables
var bTransparent = true;
var aMeses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
var aEventosMostrado = [];

// Proceso
$(document).ready(function () {
    // Cambiar transparencia de la barra de navegacion
    if ($('.navbar[color-on-scroll]').length != 0) {
        $(window).on('scroll', fNavbar.checkScrollForTransparentNavbar)
    }

    // Obtener localStorage de sesion y si no existe, crearlo
    if (localStorage.Session == null) {
        var aSession = { "Sesion": false, "UserId": "", "Token": "" }; // Crear estructura del localStorage.Session
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

    // Control boton login/cuenta. Si hay alguien logeado mostrar solo el boton cuenta, sino mostrar solo el boton login
    if (aSession["Sesion"]) {
        $('#btn-login').hide();
    } else {
        $('#btn-cuenta').hide();
    }

    // Obtener el Token del admin
    var sTokenAdmin = "";

    $.ajax({
        type: "POST",
        dataType: "html",
        async: false,
        url: `http://10.10.17.196:5000/api/Users/authenticate/username/paulac/password/1234`,
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
        url: `http://10.10.17.196:5000/api/Eventos/Centros`,
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
    $('#fecha-filter').datepicker({ dateFormat: 'dd/mm/yy' });
    Inputmask().mask("fecha-filter");

    // Añadir el autocomplete al input de centros
    $('#centros-filter').autocomplete({
        source: aCentros
    });

    // Control click boton salir
    $('#btn-salir').on('click', function (ev) {
        var aSession = { "Sesion": false, "User": "", "Token": "" }; // Crear estructura del localStorage.Session
        localStorage.Session = JSON.stringify(aSession); // Crear el localStorage.Session

        window.location.href = "./index.html"; // Recargar pagina
    })

    // Control click boton buscar
    $('#btn-filter').on('click', function (ev) {
        ev.preventDefault();

        var aEventos = [];
        var sCentros = $('#centros-filter').val();
        var sFecha = $('#fecha-filter').val();

        // Formateamos la fecha para la peticion de la api
        if (sFecha != "") {
            var aFecha = sFecha.split('/');
            var sFechaFormateada = `${aFecha[2]}-${aFecha[1]}-${aFecha[0]}`;
        }

        // Obtener un array con los eventos, basado en las condiciones del usuario
        if (sCentros != "" && sFecha == "") { // Si solo esta rellenado el campo centros
            aEventos = ObtenerEventosCentro(sCentros, sTokenAdmin);
        } else if (sCentros == "" && sFecha != "") { // Si solo esta rellenado el campo fecha
            aEventos = ObtenerEventosFecha(sFechaFormateada, sTokenAdmin);
        } else if (sCentros != "" && sFecha != "") { // Si esta rellenado ambos campos
            aEventos = ObtenerEventosFechaCentro(sFechaFormateada, sCentros, sTokenAdmin);
        } else { // Si no esta rellenado ningun campo
            aEventos = ObtenerEventos(50, sTokenAdmin);
        }

        // Crear las cartas de eventos y añadirlas a la lista de eventos
        $("#list-events").html("");
        $("#list-events").css('padding', '0');

        aEventos.forEach(evento => {
            aEventosMostrado.push(evento.id); // Guardar ID del evento en un Array

            var sDescripcion = "Próximamente se dispondrá más información sobre este evento.";
            if (evento.descripcion != "") sDescripcion = evento.descripcion;

            var dFecha = new Date(evento.fechaInicio);
            var sDia = `${dFecha.getDate()}`;
            if (sDia.length <= 1) sDia = `0${sDia}`;

            $(`<div class="card evento-${evento.id}">
                <div class="card-intro">
                    <div class="card-fecha">
                        <p class="card-dia">${sDia}</p>
                        <p>${aMeses[dFecha.getMonth()]}</p>
                    </div>
                    <p class="card-titulo">${evento.titulo}</p>
                </div>
                <div class="card-descripcion">${sDescripcion}</div>
                <div class="card-boton">
                    <button class="btn-evento">Ver más</button>
                </div>
            </div>`).appendTo("#list-events");
        });

        if (aEventos.length != 0) $("#list-events").css('padding', '5rem 0');

        // Control click link carta
        $('.btn-evento').on('click', function (ev) {
            var sId = ev.originalEvent.path[2].className.substring(12); // Obtener el id de la clase del elemento principal
            localStorage.Evento = JSON.stringify(sId); // Guardar en un localStorage el evento que se hizo clic

            localStorage.EventoMostrados = JSON.stringify(aEventosMostrado); // Crear el localStorage de los eventos que se muestran

            window.location.href = "./evento.html"; // Redirigir a la pagina del evento
        })
    })

    // Control del boton de retroceso del navegador
    if (localStorage.EventoMostrados != null) {
        var aEventosGuardados = JSON.parse(localStorage.EventoMostrados); // Obtener en Array el localStorage.EventoMostrados

        aEventosGuardados.forEach(eventoId => {
            // Obtenemos la informacion del evento en base a su ID
            $.ajax({
                type: "GET",
                dataType: "html",
                async: false,
                url: `http://10.10.17.196:5000/api/Eventos/${eventoId}`,
                headers: {
                    "accept": "application/json",
                    "Authorization": "Bearer " + sTokenAdmin
                },
                success: function (response) {
                    var aRespuestaEvento = JSON.parse(response);
                    var aEventoInformacion = aRespuestaEvento[0];

                    aEventosMostrado.push(aEventoInformacion.id); // Guardar ID del evento en un Array

                    // Crear las cartas de eventos y añadirlas a la lista de eventos
                    var sDescripcion = "Próximamente se dispondrá más información sobre este evento.";
                    if (aEventoInformacion.descripcion != "") sDescripcion = aEventoInformacion.descripcion;

                    var dFecha = new Date(aEventoInformacion.fechaInicio);
                    var sDia = `${dFecha.getDate()}`;
                    if (sDia.length <= 1) sDia = `0${sDia}`;

                    $(`<div class="card evento-${aEventoInformacion.id}">
                        <div class="card-intro">
                            <div class="card-fecha">
                                <p class="card-dia">${sDia}</p>
                                <p>${aMeses[dFecha.getMonth()]}</p>
                            </div>
                            <p class="card-titulo">${aEventoInformacion.titulo}</p>
                        </div>
                        <div class="card-descripcion">${sDescripcion}</div>
                        <div class="card-boton">
                            <button class="btn-evento">Ver más</button>
                        </div>
                    </div>`).appendTo("#list-events");
                }
            });
        })

        $("#list-events").css('padding', '5rem 0'); // Añadir espacio arriba y abajo

        localStorage.EventoMostrados = JSON.stringify(""); // Vaciamos el localStorage de eventos mostrados
    }

    // Control click link carta
    $('.btn-evento').on('click', function (ev) {
        var sId = ev.originalEvent.path[2].className.substring(12); // Obtener el id de la clase del elemento principal
        localStorage.Evento = JSON.stringify(sId); // Guardar en un localStorage el evento que se hizo clic

        localStorage.EventoMostrados = JSON.stringify(aEventosMostrado); // Crear el localStorage de los eventos que se muestran

        window.location.href = "./evento.html"; // Redirigir a la pagina del evento
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
    let bEjecutando = false;

    if (!bEjecutando) {
        $.ajax({
            type: "GET",
            dataType: "html",
            async: false,
            url: `http://10.10.17.196:5000/api/Eventos/FechaInicio/${sFecha}`,
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + sTokenAdmin
            },
            beforeSend: function () {
                bEjecutando = true;
            },
            success: function (response) {
                let aRespuesta = JSON.parse(response);

                aRespuesta.forEach(evento => {
                    aEventos.push(evento);
                });
            },
            error: function (response) {
                alert("Introduce una fecha valida.");
            },
            complete: function () {
                bEjecutando = false;
            }
        });
    }

    return aEventos;
}

function ObtenerEventosCentro(sCentro, sTokenAdmin) {
    let aEventos = [];
    let bEjecutando = false;

    if (!bEjecutando) {
        $.ajax({
            type: "GET",
            dataType: "html",
            async: false,
            url: `http://10.10.17.196:5000/api/Eventos/Centros/${sCentro}`,
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + sTokenAdmin
            },
            beforeSend: function () {
                bEjecutando = true;
            },
            success: function (response) {
                let aRespuesta = JSON.parse(response);

                aRespuesta.forEach(evento => {
                    aEventos.push(evento);
                });
            },
            error: function (response) {
                alert("Introduce un centro valida.");
            },
            complete: function () {
                bEjecutando = false;
            }
        });
    }

    return aEventos;
}

function ObtenerEventosFechaCentro(sFecha, sCentro, sTokenAdmin) {
    let aEventos = [];
    let bEjecutando = false;

    if (!bEjecutando) {
        $.ajax({
            type: "GET",
            dataType: "html",
            async: false,
            url: `http://10.10.17.196:5000/api/Eventos/Centros/${sCentro}/FechaInicio/${sFecha}`,
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + sTokenAdmin
            },
            beforeSend: function () {
                bEjecutando = true;
            },
            success: function (response) {
                let aRespuesta = JSON.parse(response);

                aRespuesta.forEach(evento => {
                    aEventos.push(evento);
                });
            },
            error: function (response) {
                alert("Introduce una fecha y/o centro validos.");
            },
            complete: function () {
                bEjecutando = false;
            }
        });
    }

    return aEventos;
}

function ObtenerEventos(nCantidad, sTokenAdmin) {
    let aEventos = [];
    let bEjecutando = false;

    if (!bEjecutando) {
        $.ajax({
            type: "GET",
            dataType: "html",
            url: `http://10.10.17.196:5000/api/Eventos`,
            async: false,
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + sTokenAdmin
            },
            beforeSend: function () {
                bEjecutando = true;
            },
            success: function (response) {
                let aRespuesta = JSON.parse(response);

                for (let index = 0; index < nCantidad; index++) {
                    aEventos.push(aRespuesta[index]);
                }
            },
            complete: function () {
                bEjecutando = false;
            }
        });
    }

    return aEventos;
}