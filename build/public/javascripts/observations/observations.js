$(function() {});

function deleteObservation(id) {
    $.post("/users/observations/remove", {'id': id}).done(function(result) {
        $('#observationPanel' + id).remove();
    });
}