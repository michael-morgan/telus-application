/**
 * Created by Bradley on 3/18/2016.
 */
$(function() {
    $( ".unchecked" ).click(function() {
        $( ".btn").removeClass('active')
        $("#submitObservation").removeClass('disabled')
        var submitButton = document.getElementById("submitObservation").type = "submit";
    });
});