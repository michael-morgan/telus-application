$(function() {});

function deleteObservation(id) {
    alert('Are you sure you want to delete this observation?');
    $.post("/users/observations/remove", {'id': id}).done(function(result) {
        $('#observationPanel' + id).remove();
    });
}