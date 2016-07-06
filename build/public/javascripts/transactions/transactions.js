$(function() {
    $('input[name="dateRange"]').daterangepicker();
    $('#successMessage').hide();
});

function deleteTransaction(id) {
    alert('Are you sure you want to delete this transaction?');
    $.post("/users/transactions", {'id': id}).done(function(result) {
        $('#transactionID' + id).remove();
        $('#successMessage').show();
        $('#successParagraph').html("The transaction was successfully deleted to the database.");
        $('#successMessage').fadeOut(5000);
    });
}