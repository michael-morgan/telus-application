$(function()
{
    //Hide the delete message until a transaction has been removed
    $('#deleteMessage').hide();
    //Fade out success message after 5 secconds
    $('#successMessage').fadeOut(5000);
});
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
    bootbox.confirm("Are you sure you want to delete this transaction?", function(result) {
        if (result == true)
        {
            $.post("/users/transactions", {'id': id}).done(function(result) {
                $('#transactionID' + id).remove();
                $('#deleteMessage').show();
                $('#removalMessage').html("The transaction was successfully deleted.");
                $('#deleteMessage').fadeOut(5000);
            });
        }
    });
}