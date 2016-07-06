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

function deleteTransaction(id) {
    alert('Are you sure you want to delete this transaction?');
    $.post("/", {'id': id}).done(function(result) {
        $('#transactionID' + id).remove();
    });
}