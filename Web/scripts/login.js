$(document).ready(function () {
    // Inicializar botones
    $('#link-signup').css('opacity', '0.7');
    $('#signup').hide();

    // Click en el boton Sign Up
    $('#link-signup').on('click', function () {
        $('#link-signup').css('opacity', '1');
        $('#link-login').css('opacity', '0.7');
        $('#signup').show();
        $('#login').hide();
    })

    // Click en el boton Log-in
    $('#link-login').on('click', function () {
        $('#link-login').css('opacity', '1');
        $('#link-signup').css('opacity', '0.7');
        $('#login').show();
        $('#signup').hide();
    })

    // Logearse
    $('#btn-login').on('click', function (ev) {
        ev.preventDefault();

        var usuario = $('#usuario-login').val();
        var contraseña = $('#contraseña-login').val();

        ValidarUsuario(usuario, contraseña);
    })

    // Registrarse
    $('#btn-signup').on('click', function (ev) {
        ev.preventDefault();

        var nombre = $('#nombre-signup').val();
        var apellido = $('#apellido-signup').val();
        var email = $('#email-signup').val();
        var telefono = $('#telefono-signup').val();
        var usuario = $('#usuario-signup').val();
        var contraseña = $('#contraseña-signup').val();

        CrearUsuario(nombre, apellido, email, telefono, usuario, contraseña);
    })
});

// Funcion para validar si el usuario existe en la BD
function ValidarUsuario(username, password) {
    $.ajax({
        type: "POST",
        dataType: "html",
        url: `http://localhost:5000/api/Users/authenticate/username/${username}/password/${password}`,
        headers: {
            "accept": "application/json",
        },
        success: function (response) { // Si el usuario existe
            var aUsuario = JSON.parse(response);
            
            var aSession = { "Sesion": true, "UserId": aUsuario.id, "Token": aUsuario.token }; // Crear estructura del localStorage
            localStorage.Session = JSON.stringify(aSession); // Crear/modificar el localStorage

            window.location.href = "./index.html"; // Redirigir al inicio
        },
        error: function (response, status) { // Si el usuario no existe
            alert("Usuario o contraseña incorrecta");

            var aSession = { "Sesion": false, "UserId": "", "Token": ""}; // Crear estructura del localStorage
            localStorage.Session = JSON.stringify(aSession); // Crear/modificar el localStorage
        }
    });
}

// Funcion para validar si el usuario existe en la BD
function CrearUsuario(nombre, apellido, email, telefono, usuario, contraseña) {
    var role = "user";
    
    $.ajax({
        type: "POST",
        dataType: "html",
        url: `http://localhost:5000/api/Users/Nombre/${nombre}/Apellido/${apellido}/Role/${role}/Email/${email}/Telefono/${telefono}/Username/${usuario}/Password/${contraseña}`,
        headers: {
            "accept": "application/json",
        },
        success: function () {
            ValidarUsuario(usuario, contraseña);
        }
    });
}