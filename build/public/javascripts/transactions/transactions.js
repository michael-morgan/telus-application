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

    var result;

    bootbox.confirm("Are you sure you want to delete this transaction?", function(result) {
        if (result == true)
        {
            $.post("/users/transactions", {'id': id}).done(function(result) {
                $('#transactionID' + id).remove();
                $('#successMessage').show();
                $('#successParagraph').html("The transaction was successfully deleted to the database.");
                $('#successMessage').fadeOut(5000);
            });
        }
    });
}