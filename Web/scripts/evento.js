const { Alert } = require("bootstrap");

$(document).ready(function () {
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

    // Obtener informacion del evento
    var aEvento = [];
    var sId = JSON.parse(localStorage.Evento);

    $.ajax({
        type: "GET",
        dataType: "html",
        async: false,
        url: `http://10.10.17.196:5000/api/Eventos/${sId}`,
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer " + sTokenAdmin
        },
        success: function (response) {
            var aRespuestaEvento = JSON.parse(response);
            aEvento = aRespuestaEvento[0];
        }
    });

    // Creacion del mapa
    var zoom = 17;
    var map = L.map('map').setView([aEvento.latitud, aEvento.longitud], zoom); // Posicion de vision del mapa

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); // Añadir mapa al HTML
    const marker = new L.marker([aEvento.latitud, aEvento.longitud]).bindPopup(aEvento.organizacion).addTo(map); // Añadir marcador al mapa0

    // Crear contenido del evento
    var dFechaInicio = new Date(aEvento.fechaInicio);
    var dFechaFin = new Date(aEvento.fechaFin);

    // Formatear fecha inicio
    var sDiaInicio = `${dFechaInicio.getDate()}`;
    if (sDiaInicio.length <= 1) sDiaInicio = `0${dFechaInicio.getDate()}`;

    var sMesInicio = `${dFechaInicio.getMonth()}`;
    if (sMesInicio.length <= 1) sMesInicio = `0${dFechaInicio.getMonth()}`;

    var sHoraInicio = (`${dFechaInicio}`).substring(15, 21);

    var sFechaInicio = `${sDiaInicio}/${sMesInicio}/${dFechaInicio.getFullYear()}, ${sHoraInicio}`;

    // Formatear fecha fin
    var sDiaFin = `${dFechaFin.getDate()}`;
    if (sDiaFin.length <= 1) sDiaFin = `0${dFechaFin.getDate()}`;

    var sMesFin = `${dFechaInicio.getMonth()}`;
    if (sMesFin.length <= 1) sMesFin = `0${dFechaFin.getMonth()}`;

    var sHoraFin = (`${dFechaFin}`).substring(15, 21);

    var sFechaFin = `${sDiaFin}/${sMesFin}/${dFechaFin.getFullYear()}, ${sHoraFin}`;

    // Añadir informacion al HTML
    var sDescripcion = "Próximamente se dispondrá más información sobre este evento.";
    if (aEvento.descripcion != "") sDescripcion = aEvento.descripcion;
            
    $(`<h1>${aEvento.titulo}</h1>

        <p id="descripcion">${sDescripcion}</p>

        <div id="localizacion">
            <p>Ubicacion: ${aEvento.direccion}, ${aEvento.postal}</p>
            <p>Centro: ${aEvento.organizacion}</p>
        </div>

        <div id="fechas">
            <p>Fecha y hora inicio: ${sFechaInicio}</p>
            <p>Fecha y hora fin: ${sFechaFin}</p>
        </div>

        <p id="link">Link: <a href="${aEvento.link}">Más información</a></p>
        
        <button class="btn rounded-pill" id="btn-inscribirse">Inscribirse</button>`).appendTo("#informacion");

    // Control click boton salir
    $('#btn-salir').on('click', function (ev) {
        var aSession = { "Sesion": false, "User": "", "Token": "" }; // Crear estructura del localStorage.Session
        localStorage.Session = JSON.stringify(aSession); // Crear el localStorage.Session

        window.location.href = "./index.html"; // Recargar pagina
    })

    // Control click boton inscribirse
    $('#btn-inscribirse').on('click', function (ev) {
        let aSession = JSON.parse(localStorage.Session);
        let sEvento = JSON.parse(localStorage.Evento);

        $.ajax({
            type: "POST",
            dataType: "html",
            async: false,
            url: `http://10.10.17.196:5000/api/Inscripciones/User/${aSession.UserId}/Evento/${sEvento}`,
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + sTokenAdmin
            }
        });

        window.location.href = "./index.html"; // Recargar pagina
    })
})