var aMeses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];

$(document).ready(function () {
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

    // Obtener las id's de los eventos
    var aInscripcion = [];
    var aSession = JSON.parse(localStorage.Session);

    $.ajax({
        type: "GET",
        dataType: "html",
        async: false,
        url: `http://localhost:5000/api/Inscripciones/UserId/${aSession.UserId}`,
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer " + sTokenAdmin
        },
        success: function (response) {
            aInscripcion = JSON.parse(response);
        }
    });

    // Obtener los eventos
    var aEventos = [];

    aInscripcion.forEach(inscripcion => {
        $.ajax({
            type: "GET",
            dataType: "html",
            async: false,
            url: `http://localhost:5000/api/Eventos/${inscripcion.eventoId}`,
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + sTokenAdmin
            },
            success: function (response) {
                var aRespuesta = JSON.parse(response);
                aEventos.push(aRespuesta[0]);
            }
        });
    });

    // Añadir informacion al HTML
    aEventos.forEach(evento => {
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
                <button class="btn-desinscribir">Desinscribirse</button>
                <button class="btn-evento">Ver más</button>
            </div>
        </div>`).appendTo("#list-inscripciones");
    });

    // Control click boton salir
    $('#btn-salir').on('click', function (ev) {
        var aSession = { "Sesion": false, "UserId": "", "Token": "" }; // Crear estructura del localStorage.Session
        localStorage.Session = JSON.stringify(aSession); // Crear el localStorage.Session

        window.location.href = "./index.html"; // Recargar pagina
    })

    // Control click link carta
    $('.btn-evento').on('click', function (ev) {
        var sId = ev.originalEvent.path[2].className.substring(12); // Obtener el id de la clase del elemento principal
        localStorage.Evento = JSON.stringify(sId);

        window.location.href = "./evento.html"; // Redirigir a la pagina del evento
    })

    // Control click boton desinscribirse
    $('.btn-desinscribir').on('click', function (ev) {
        var sId = ev.originalEvent.path[2].className.substring(12); // Obtener el id de la clase del elemento principal
        var aInscripcionUsuario = [];

        // Obtener inscripcion del evento
        $.ajax({
            type: "GET",
            dataType: "html",
            async: false,
            url: `http://localhost:5000/api/Inscripciones/EventoId/${sId}`,
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + sTokenAdmin
            },
            success: function (response) {
                var aRespuesta = JSON.parse(response);
                aInscripcionUsuario = aRespuesta[0];
            }
        });
        // Borrar la inscripcion del evento
        $.ajax({
            type: "DELETE",
            dataType: "html",
            async: false,
            url: `http://localhost:5000/api/Inscripciones/${aInscripcionUsuario.id}`,
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + sTokenAdmin
            }
        });

        window.location.href = "./inscripciones.html"; // Recargar pagina
    })
})