$('input[name="dateRange"]').daterangepicker(
    {
        locale: {
            format: 'MMMM D, YYYY'
        }
    },
    function(start, end, label) {
        alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    }
);

function deleteObservation(id) {
    alert('Are you sure you want to delete this observation?');
    $.post("/users/observations/remove", {'id': id}).done(function(result) {
        $('#observationPanel' + id).remove();
    });
}