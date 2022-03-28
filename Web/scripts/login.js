$(document).ready(function () {
    // Login
    // -> Inicializar
    $('#link-signup').css('opacity', '0.7');
    $('#signup').hide();

    // -> Boton de click en Sign Up
    $('#link-signup').on('click', function () {
        $('#link-signup').css('opacity', '1');
        $('#link-login').css('opacity', '0.7');
        $('#signup').show();
        $('#login').hide();
    })

    // -> Boton de click en Log-in
    $('#link-login').on('click', function () {
        $('#link-login').css('opacity', '1');
        $('#link-signup').css('opacity', '0.7');
        $('#login').show();
        $('#signup').hide();
    })
});